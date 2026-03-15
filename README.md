# 中午吃啥 - 午餐随机抽取系统

解决团队日常午餐选择困难的问题，通过趣味性的随机抽取动画帮你决定今天吃什么。

## 功能特性

- **菜品管理**：添加、编辑、删除菜品，支持分类和权重设置
- **随机抽取**：按权重概率随机抽取，配合滚动动画效果
- **海报生成**：抽取结果自动生成精美海报，支持下载分享
- **历史记录**：查看过往抽取结果，避免重复选择
- **数据导出**：支持 JSON/CSV 格式导出菜品数据

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + TypeScript |
| 动画 | Framer Motion |
| 海报 | html2canvas |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | SQLite (better-sqlite3) |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 开发模式

```bash
# 启动后端（端口 3001）
cd server
npm run dev

# 启动前端（端口 5173）
cd client
npm run dev
```

### 生产部署

```bash
# 构建前端
cd client
npm run build

# 启动生产服务（PM2）
cd ../server
npm run build
pm2 start ecosystem.config.js
```

### 一键启动

```bash
# 在项目根目录
npm run start:prod
```

## 项目结构

```
EatWhat/
├── client/          # 前端 React 应用
│   └── src/
│       ├── components/    # 通用组件
│       ├── pages/         # 页面组件
│       ├── features/      # 功能模块（抽取动画、海报）
│       ├── api/           # API 请求
│       └── types/         # 类型定义
├── server/          # 后端 Express 服务
│   └── src/
│       ├── routes/        # API 路由
│       ├── services/      # 业务逻辑
│       └── db/            # 数据库
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/dishes | 获取所有菜品 |
| POST | /api/dishes | 添加菜品 |
| PUT | /api/dishes/:id | 编辑菜品 |
| DELETE | /api/dishes/:id | 删除菜品 |
| POST | /api/lottery/draw | 随机抽取 |
| GET | /api/lottery/history | 抽取历史 |
| GET | /api/export/json | 导出 JSON |
| GET | /api/export/csv | 导出 CSV |

## 许可证

MIT
