# 🍜 中午吃啥 - 午餐随机抽取系统

> 解决「中午吃什么」这个世纪难题！通过趣味性的随机抽取动画，帮你决定今天吃啥。

**在线体验：https://jiuxiaoyijian.github.io/EatWhat/**

## 功能特性

- **随机抽取** — 按菜品权重概率随机抽取，配合快→慢→停的滚动动画 + 礼花特效
- **菜品管理** — 添加、编辑、删除菜品，支持分类和权重（1-10）设置
- **海报生成** — 抽取结果自动生成暖色调精美海报，支持下载 PNG
- **历史记录** — 查看过往抽取结果，避免重复选择
- **数据导入导出** — 支持 JSON/CSV 格式导出，JSON 格式导入，防止数据丢失
- **内置菜单** — 首次使用自带 12 道经典中式菜品，即开即用
- **响应式设计** — 适配手机和电脑，移动端操作按钮大而易点

## 技术栈

| 技术 | 说明 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Framer Motion | 抽取滚动动画 + 结果展示动效 |
| canvas-confetti | 礼花特效 |
| html2canvas | 海报图片生成 |
| localStorage | 浏览器端数据持久化 |
| GitHub Pages | 静态站点托管 |
| GitHub Actions | 自动构建部署 |

## 本地开发

```bash
# 环境要求：Node.js >= 18

# 克隆项目
git clone https://github.com/jiuxiaoyijian/EatWhat.git
cd EatWhat/client

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 浏览器打开 http://localhost:5173/EatWhat/
```

## 构建部署

```bash
cd client
npm run build
# 产物在 client/dist/ 目录，可部署到任何静态文件服务器
```

**GitHub Pages 自动部署**：每次推送到 `master` 分支，GitHub Actions 自动构建并部署到 https://jiuxiaoyijian.github.io/EatWhat/

## 项目结构

```
EatWhat/
├── client/                      # React 前端应用
│   ├── src/
│   │   ├── api/dishes.ts        # 数据服务层（localStorage）
│   │   ├── components/          # 通用组件（DishCard, DishForm, WeightBar, Navbar）
│   │   ├── features/
│   │   │   ├── lottery/         # 抽取动画（LotteryWheel, ResultDisplay）
│   │   │   └── poster/         # 海报生成（PosterCanvas）
│   │   ├── pages/              # 页面（HomePage, DishManagePage, HistoryPage）
│   │   ├── styles/             # 全局样式
│   │   └── types/              # TypeScript 类型定义
│   └── vite.config.ts
├── .github/workflows/deploy.yml # GitHub Actions 自动部署
└── README.md
```

## 数据说明

- 数据存储在浏览器 `localStorage` 中，刷新页面不丢失
- 清除浏览器缓存会重置数据（将自动恢复默认菜单）
- 通过菜品管理页的「导出JSON」备份数据，「导入」恢复数据
- 不同浏览器/设备的数据相互独立

## 默认菜品

首次使用自带 12 道经典中式菜品：黄焖鸡米饭、兰州拉面、麻辣烫、红烧牛肉面、宫保鸡丁饭、番茄鸡蛋盖饭、酸菜鱼、沙县小吃、麻辣香锅、肉夹馍+凉皮、煲仔饭、水饺。

## 许可证

MIT
