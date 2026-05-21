# expo-app

一个基于 **Expo Router + React Native + TypeScript** 的跨端应用模板，覆盖 iOS / Android / Web，并集成了完整的现代应用基础设施：认证（better-auth）、API（Expo API Routes）、类型安全后端（tRPC）、数据库（Prisma）、AI 对话（assistant-ui + AI SDK）与统一样式系统（Uniwind/Tailwind）。

## 当前代码结构总览（2026-05）

### 1) 应用入口与运行时

- `src/app/_layout.tsx` 是根入口：
  - 注入 `global.css`
  - 挂载 `TRPCReactProvider`
  - 挂载 `AnimatedSplashOverlay`
  - 使用 `SafeAreaListener` 将 inset 同步给 `Uniwind`
  - 配置 `PortalHost` 与 `sonner-native` toaster
- `src/components/app-stack.tsx` 负责路由保护：
  - 通过 `authClient.useSession()` 判断登录态
  - `Stack.Protected` 控制 `(protected)` 与 `sign-in` 访问权限

### 2) 路由结构（Expo Router）

```text
src/app
├── _layout.tsx
├── sign-in.tsx
├── (protected)
│   ├── _layout.tsx
│   ├── assistant.tsx
│   └── (tabs)
│       ├── _layout.tsx
│       ├── explore.tsx
│       └── (home)
│           ├── _layout.tsx
│           └── index.tsx
└── api
    ├── chat+api.ts
    ├── post+api.ts
    ├── auth/[...route]+api.ts
    └── trpc/[...route]+api.ts
```

### 3) 认证体系（better-auth）

- `src/lib/better-auth/config.ts`：better-auth 服务端配置（含 Prisma adapter / expo 插件）
- `src/lib/better-auth/index.ts`：导出 auth 实例
- `src/lib/better-auth/client.ts`：客户端 `authClient`
- `src/lib/better-auth/server.ts`：服务端 session 读取封装
- `src/app/sign-in.tsx` + `src/components/forms/*`：登录/注册表单 UI
- `src/app/api/auth/[...route]+api.ts`：认证 API 路由入口

### 4) 数据层与类型安全 API

- **Prisma**
  - `prisma/schema.prisma`：数据模型
  - `prisma/migrations/*`：迁移记录
  - `src/server/db.ts`：Prisma 客户端初始化
- **tRPC**
  - `src/server/api/trpc.ts`：context/procedure 中心
  - `src/server/api/root.ts`：主路由聚合
  - `src/server/api/routers/post.ts`：示例业务 router
  - `src/app/api/trpc/[...route]+api.ts`：HTTP 适配入口
  - `src/trpc/*`：客户端 query/react 集成

### 5) AI Assistant 模块

- `src/app/(protected)/assistant.tsx`：Assistant 页面
- `src/components/assistant-ui/*`：thread、message、composer、tool 渲染
- `src/hooks/use-app-runtime.ts`：assistant runtime 封装
- `src/app/api/chat+api.ts`：聊天接口（AI SDK 模型调用）

### 6) UI 与样式体系

- `src/components/ui/*`：基础 UI 原子组件（button/input/tabs/card 等）
- `src/components/*`：业务组件（如 profile-button、post-list 等）
- `src/global.css`：主题变量与样式入口
- `metro.config.js`：Uniwind 配置接入
- `components.json`：UI 组件配置

### 7) 其他核心目录

- `src/constants/`：平台常量
- `src/functions/`：服务端渲染示例函数
- `src/stores/`：客户端状态仓库
- `assets/`：图标、图片与品牌资源

---

## 技术栈

- **App**: Expo 56, React Native 0.85, React 19
- **Router**: expo-router
- **Auth**: better-auth, @better-auth/expo
- **API**: Expo API Routes + tRPC
- **DB**: Prisma + @prisma/client
- **AI**: @assistant-ui/react-native + @assistant-ui/react-ai-sdk + AI SDK provider
- **State**: TanStack Query, Zustand
- **Styling**: Uniwind + Tailwind CSS 4
- **Forms**: react-hook-form + zod

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 初始化数据库（按需）

```bash
pnpm db:generate
pnpm db:push
```

### 3. 启动开发

```bash
pnpm start
```

常用平台命令：

```bash
pnpm ios
pnpm android
pnpm web
```

---

## 常用脚本

- `pnpm start`：启动 Expo 开发服务
- `pnpm ios` / `pnpm android` / `pnpm web`：按平台运行
- `pnpm prebuild`：重建原生工程
- `pnpm lint`：代码检查
- `pnpm format:check`：格式检查
- `pnpm format:write`：自动格式化
- `pnpm db:generate`：生成并执行 Prisma 开发迁移
- `pnpm db:migrate`：部署迁移
- `pnpm db:push`：推送 schema 到数据库
- `pnpm db:studio`：打开 Prisma Studio

---

## 开发建议

1. 若在真机调试 AI 对话，请将 chat API 地址从 `localhost` 改为可访问的局域网/公网地址。
2. 提交前建议至少执行 `pnpm lint` 与一次目标平台联调（Web + iOS/Android 其一）。
3. 认证、数据库与 tRPC 已成体系，新增业务建议优先沿用：`router -> procedure -> client hook` 的结构。

## License

详见仓库 `LICENSE` 文件。
