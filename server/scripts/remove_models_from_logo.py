import json
from pathlib import Path

def main():
    logo_path = Path(r"d:\code\llm-news\fronted\lib\logo.json")
    data = None
    with logo_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and "models" in item:
                item.pop("models", None)
    with logo_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()

