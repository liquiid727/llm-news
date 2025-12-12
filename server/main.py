import requests
import pandas as pd
import json
import logging
from datetime import datetime, timezone
import os
import shutil

# 1. 获取数据
full_url = "https://api.zeroeval.com/leaderboard/models/full?justCanonicals=true"
list_url = "https://api.zeroeval.com/leaderboard/models/list"

full_data = requests.get(full_url).json()
list_data = requests.get(list_url).json()

# 2. 将 /list 接口的嵌套结构扁平化，方便匹配
model_list_for_match = []
for org in list_data:
    for model in org['models']:
        model_list_for_match.append({
            'model_id': model['model_id'],
            'model_name_list': model['name'], # 来自list接口的模型名
            'org_name_list': org['name'] # 来自list接口的服务商全名
        })

# 3. 转换为DataFrame
df_full = pd.DataFrame(full_data)
df_list = pd.DataFrame(model_list_for_match)

# 4. 根据 model_id 进行左连接，将/list的信息合并到/full的数据中
df_merged = pd.merge(df_full, df_list, on='model_id', how='left')

# 5. (可选)清洗与调整：如果两个来源的模型名有差异，可以优先使用list中的版本
# 例如，用来自list接口的模型名覆盖原有的name字段
df_merged['name'] = df_merged['model_name_list'].combine_first(df_merged['name'])

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("leaderboard_transform")
timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")

schema_path = r"d:\code\llm-news\schema\leaderboard_model.json"
with open(schema_path, "r", encoding="utf-8") as f:
    schema_def = json.load(f)

def _parse_allowed_types(desc: str):
    t = desc.lower()
    allowed = set()
    if "string" in t:
        allowed.add("string")
    if "number" in t:
        allowed.add("number")
    if "null" in t:
        allowed.add("null")
    if "object" in t:
        allowed.add("object")
    if "array" in t:
        allowed.add("array")
    return allowed

def _validate_value(value, allowed):
    if value is None:
        return "null" in allowed
    if "string" in allowed and isinstance(value, str):
        return True
    if "number" in allowed and isinstance(value, (int, float)) and not pd.isna(value):
        return True
    if "object" in allowed and isinstance(value, dict):
        return True
    if "array" in allowed and isinstance(value, list):
        return True
    return False

def _slug(s: str | None):
    if s is None:
        return None
    return "".join(ch.lower() for ch in s if ch.isalnum() or ch in ("-", "_"))

def _to_number(x):
    try:
        if x is None or (isinstance(x, float) and pd.isna(x)):
            return None
        num = pd.to_numeric(x, errors="coerce")
        if pd.isna(num):
            return None
        return float(num)
    except Exception:
        return None

def _pick(row: pd.Series, keys: list[str]):
    for k in keys:
        if k in row:
            v = row.get(k, None)
            if v is not None and not (isinstance(v, float) and pd.isna(v)):
                return v
    return None

def _pick_str(row: pd.Series, keys: list[str]):
    v = _pick(row, keys)
    if v is None:
        return None
    return str(v)

def _pick_num(row: pd.Series, keys: list[str]):
    v = _pick(row, keys)
    return _to_number(v)

schema_model = schema_def.get("data_structure", {}).get("models", [{}])[0]

def row_to_model(row: pd.Series):
    org_name = row.get("org_name_list", None) or row.get("organization", None)
    org_id = _slug(row.get("organization", None))
    scores_map = {
        "aime_2025": _to_number(row.get("aime_2025_score", None)),
        "gpqa": _to_number(row.get("gpqa_score", None)),
        "mmmu": _to_number(row.get("mmmu_score", None)) if "mmmu_score" in row else None,
        "chat": _to_number(row.get("chat_score", None)) if "chat_score" in row else None,
        "swe_bench": _to_number(row.get("swe_bench_verified_score", None)) if "swe_bench_verified_score" in row else None,
        "code": _to_number(row.get("code_score", None)) if "code_score" in row else None,
    }
    meta_map = {
        "release_date": _pick_str(row, ["release_date", "release_time", "date"]),
        "license": _pick_str(row, ["license", "model_license", "license_name"]),
        "context_length": _pick_num(row, ["context_length", "max_context", "context_window", "context_tokens"]),
        "input_price": _pick_num(row, ["input_price", "input_price_per_million", "price_input", "prompt_price"]),
        "output_price": _pick_num(row, ["output_price", "output_price_per_million", "price_output", "completion_price"]),
    }
    model = {
        "model_id": row.get("model_id", None),
        "name": row.get("name", None),
        "organization": {
            "id": org_id,
            "name": org_name,
            "icon_url": None,
        },
        "scores": scores_map,
        "meta": meta_map,
        "rank": {
            "overall": None,
            "last_change": None,
        },
    }
    return model

def validate_model(model: dict, spec: dict):
    errors = []
    for key, spec_val in spec.items():
        if isinstance(spec_val, dict):
            if key not in model or not isinstance(model[key], dict):
                errors.append(f"{key} missing or not object")
                continue
            child_ok, child_errs = validate_model(model[key], spec_val)
            if not child_ok:
                errors.extend([f"{key}.{e}" for e in child_errs])
        else:
            allowed = _parse_allowed_types(spec_val)
            val = model.get(key, None)
            if not _validate_value(val, allowed):
                errors.append(f"{key} type invalid: got {type(val).__name__}, allowed {allowed}")
    return (len(errors) == 0, errors)

models = []
invalid_items = []
logger.info("starting transformation and validation")
for _, row in df_merged.iterrows():
    try:
        m = row_to_model(row)
        ok, errs = validate_model(m, schema_model)
        if ok:
            models.append(m)
        else:
            invalid_items.append({"model_id": m.get("model_id"), "errors": errs})
    except Exception as e:
        invalid_items.append({"model_id": row.get("model_id"), "errors": [str(e)]})

logger.info(f"total: {len(df_merged)}, valid: {len(models)}, invalid: {len(invalid_items)}")
errors_path = os.path.join(os.path.dirname(__file__), "zeroeval_conversion_errors.json")
with open(errors_path, "w", encoding="utf-8") as f:
    json.dump(invalid_items, f, ensure_ascii=False, indent=2)

# 6. 查看整合后的关键列（转换完成的数量与示例）
print(pd.DataFrame(models[:5])[[ "model_id", "name" ]])

# 7. 保存到文件（备份原始CSV并输出JSON）
csv_path = os.path.join(os.path.dirname(__file__), "zeroeval_merged_leaderboard.csv")
df_merged.to_csv(csv_path, index=False, encoding='utf-8')
backup_path = os.path.join(os.path.dirname(__file__), f"zeroeval_merged_leaderboard.backup-{timestamp.replace(':','-')}.csv")
try:
    shutil.copyfile(csv_path, backup_path)
    logger.info(f"backup created: {backup_path}")
except Exception as e:
    logger.error(f"backup failed: {e}")

output_json = {
    "version": "1.0",
    "last_updated": timestamp,
    "data_structure": {
        "models": models,
        "last_fetched": timestamp
    }
}
json_path = os.path.join(os.path.dirname(__file__), "zeroeval_merged_leaderboard.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(output_json, f, ensure_ascii=False, indent=2)
logger.info(f"json saved: {json_path}")
