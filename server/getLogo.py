import requests

# 读取之前保存的整合数据
df = pd.read_csv('zeroeval_merged_leaderboard.csv')
# 获取不重复的服务商列表
orgs = df['organization'].dropna().unique()

for org in orgs:
    # 简单构造一个可能的官网域名（注意：这只是一个假设，可能不准）
    # 例如：将 "Anthropic" 转为 "anthropic.com"
    domain_guess = f"https://{org.lower().replace(' ', '')}.com"
    favicon_url = f"{domain_guess}/favicon.ico"
    try:
        response = requests.get(favicon_url, timeout=5)
        if response.status_code == 200:
            # 保存图标文件
            with open(f'{org}_favicon.ico', 'wb') as f:
                f.write(response.content)
            print(f"成功下载: {org}")
        else:
            print(f"未找到: {org} 的favicon")
    except:
        print(f"尝试失败: {org}")