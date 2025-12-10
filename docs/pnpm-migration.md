# 使用 pnpm 的迁移与构建记录

本文档记录将项目从现有包管理器迁移到 pnpm 的完整过程、遇到的问题及解决方案，以及后续使用说明。

## 迁移步骤

- 全局安装 pnpm：`npm install -g pnpm`
- 清理旧依赖与锁文件：删除 `node_modules`、`package-lock.json`
- 使用 pnpm 安装依赖：`pnpm install`
- 进行构建验证：`pnpm run build`

## 遇到的问题与修复

- Ignored build scripts: sharp
  - 现象：`pnpm install` 提示忽略 `sharp` 的构建脚本
  - 处理：在 `package.json` 中添加：
    ```json
    {
      "pnpm": {
        "onlyBuiltDependencies": ["sharp"]
      }
    }
    ```
    然后执行 `pnpm rebuild`

- TypeScript 构建错误（循环类型引用）
  - 位置：`app/leaderboard/page.tsx:34`
  - 现象：`'leaderboardDataMap' is referenced directly or indirectly in its own type annotation`
  - 处理：为排行榜项定义独立的 `LeaderboardItem` 类型，并将 `leaderboardDataMap` 的类型改为 `Record<string, LeaderboardItem[]>`；将组件入参中的 `item` 类型改为 `LeaderboardItem`

- 依赖版本对齐（React/ReactDOM）
  - 现象：生态中存在 `19.2.0` 与 `19.2.1` 的微版本差异
  - 处理：在 `package.json` 中将 `react` 与 `react-dom` 设为 `^19.2.1`，并通过 `pnpm.overrides` 强制一致：
    ```json
    {
      "pnpm": {
        "overrides": {
          "react": "19.2.1",
          "react-dom": "19.2.1"
        }
      }
    }
    ```

## 验证结果

- 构建：`pnpm run build` 成功，无报错
- 产物：Next.js 生成的静态页面正常产出
- 测试：项目未配置测试框架，暂无测试用例
- 文档：`README.md` 已更新为首选使用 pnpm 的说明

## 后续建议

- 如需启用 ESLint，请添加 `eslint` 到 `devDependencies`，并使用 `pnpm run lint`
- 可在 CI 环境中使用 `pnpm approve-builds` 或 `pnpm.onlyBuiltDependencies` 配置保证依赖构建一致性

