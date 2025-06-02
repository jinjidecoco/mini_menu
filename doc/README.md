# 程序员做饭指南微信小程序

> 用代码思维重构烹饪流程，让烹饪更精准、可追踪、可复现。

## 项目概览

基于GitHub开源项目[HowToCook](https://github.com/Anduin2017/HowToCook)的数据源，打造面向程序员群体的结构化菜谱小程序。我们采用苹果极简风格设计，追求高级感与易用性的完美平衡。

## 目录结构

```
cook/
├── doc/                    # 项目文档
│   ├── README.md           # 项目概览（当前文档）
│   ├── progress.md         # 开发进度记录
│   └── api.md              # API接口文档
├── miniprogram/            # 小程序源代码
│   ├── app.js              # 小程序入口文件
│   ├── app.json            # 小程序全局配置
│   ├── app.wxss            # 小程序全局样式
│   ├── components/         # 自定义组件
│   ├── images/             # 图片资源
│   ├── pages/              # 页面文件
│   └── utils/              # 工具函数
├── cloudfunctions/         # 云函数
│   ├── recipeSync/         # 菜谱同步函数
│   └── userFeedback/       # 用户反馈处理函数
└── project.config.json     # 项目配置文件
```

## 技术选型

| 层级 | 技术方案 | 说明 |
|------|----------|------|
| **前端** | WXML + WXSS + JavaScript | 微信小程序原生开发，UI遵循苹果极简风格 |
| **状态管理** | MobX-miniprogram | 轻量级状态管理，支持响应式数据绑定 |
| **后端** | 微信云开发（CloudBase） | 无服务器架构，降低运维成本 |
| **数据库** | CloudDB（NoSQL） | 文档型数据库，适合菜谱数据存储 |
| **数据同步** | GitHub Webhook + 云函数 | 自动同步GitHub仓库更新 |
| **DevOps** | GitHub Actions | 自动化构建测试，微信审核提交流程集成 |

## 启动命令

### 开发环境

1. 克隆仓库并安装依赖：

```bash
git clone <repository-url>
cd cook
npm install
```

2. 使用微信开发者工具打开项目：

```bash
# macOS
open -a "微信开发者工具" --args "$(pwd)"

# 或手动打开微信开发者工具并导入项目
```

3. 云函数本地调试：

```bash
# 进入云函数目录
cd cloudfunctions/recipeSync
npm install
npm run dev
```

### 部署

```bash
# 部署云函数
npm run deploy:cloud

# 上传小程序代码
npm run deploy:mini
```

## 设计理念

我们的设计遵循苹果的设计哲学：简约、优雅、功能性。UI元素保持克制，注重空间利用和排版层次，让用户专注于内容本身。配色方案采用中性色调为主，辅以少量强调色，确保视觉上的高级感和一致性。