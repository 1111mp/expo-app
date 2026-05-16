# expo-app

一个基于 Expo Router 的跨端（iOS / Android / Web）React Native 示例应用。项目在官方 Expo Starter 的基础上扩展了登录态保护、原生/网页标签导航、主题化组件、Uniwind 样式体系，以及 assistant-ui 驱动的 AI 对话界面和天气工具示例。

## 项目概览

- **应用类型**：Expo + React Native + React 19 跨端应用。
- **路由方案**：使用 `expo-router` 文件系统路由，并通过 `Stack.Protected` 做登录态路由保护。
- **状态管理**：使用 `zustand` + `persist` 保存登录状态；Web 端使用 `localStorage`，原生端使用 `expo-secure-store`。
- **样式方案**：使用 Tailwind CSS 4 + Uniwind，支持暗色/亮色主题变量、NativeWind 风格的 `className` 写法和安全区 inset 同步。
- **AI 对话**：集成 `@assistant-ui/react-native` 与 `@assistant-ui/react-ai-sdk`，客户端默认请求 `http://localhost:3000/api/chat`。
- **工具调用示例**：内置 Open-Meteo 地理编码和天气查询工具，无需 API Key。
- **后端/服务端示例**：包含 Expo Router API Route 示例 `/api/post`，以及一个 server component 风格的 `renderPost` 示例。

## 技术栈

| 分类        | 技术                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| 框架        | Expo `~56.0.0-preview.12`, React Native `0.85.3`, React `19.2.3`                |
| 路由        | `expo-router` `~56.2.1`                                                         |
| Web         | `react-native-web`, Expo web server output                                      |
| UI / 样式   | `uniwind`, Tailwind CSS 4, `class-variance-authority`, `clsx`, `tailwind-merge` |
| 图标 / 视觉 | `@expo/vector-icons`, `expo-symbols`, `expo-image`, `expo-glass-effect`         |
| 状态        | `zustand`, `expo-secure-store`                                                  |
| Assistant   | `@assistant-ui/react-native`, `@assistant-ui/react-ai-sdk`, `zod`               |
| 动画        | `react-native-reanimated`, `react-native-worklets`                              |
| 语言        | TypeScript strict mode                                                          |
| 包管理      | pnpm                                                                            |

## 目录结构

```text
.
├── app.json                    # Expo 应用配置、插件、平台包名与实验特性
├── assets/                     # 图标、启动图、示例图片和 tab 图标
├── metro.config.js             # Metro + Uniwind 配置
├── package.json                # 依赖和 npm/pnpm scripts
├── pnpm-lock.yaml              # pnpm 锁文件
├── pnpm-workspace.yaml         # pnpm workspace / nodeLinker 配置
├── src/
│   ├── app/                    # Expo Router 路由入口
│   │   ├── _layout.tsx         # 根布局：主题、Splash、Uniwind inset、AppStack
│   │   ├── login.tsx           # 登录页
│   │   ├── api/post+api.ts     # API Route 示例：GET /api/post
│   │   └── (protected)/        # 登录后可访问的页面组
│   │       ├── _layout.tsx     # 受保护区域 Stack 配置
│   │       ├── assistant.tsx   # AI Assistant 页面
│   │       └── (tabs)/         # Home / Explore tabs
│   ├── components/             # 主题组件、导航组件、Assistant UI、通用 UI
│   ├── constants/              # 平台常量
│   ├── functions/              # Server function 示例
│   ├── hooks/                  # 应用 hooks，例如 assistant runtime
│   ├── stores/                 # Zustand stores
│   ├── utils/                  # 工具函数
│   ├── global.css              # Tailwind / Uniwind 入口与主题 token
│   └── uniwind-types.d.ts      # Uniwind 类型声明
├── tsconfig.json               # TypeScript 配置和路径别名
└── LICENSE
```

## 路由与页面

当前应用的主要路由如下：

| 路由         | 文件                                          | 说明                                                                               |
| ------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/login`     | `src/app/login.tsx`                           | 未登录时展示的登录页，点击按钮写入登录态。                                         |
| `/`          | `src/app/(protected)/(tabs)/(home)/index.tsx` | 受保护 Home tab，包含欢迎页、登出、Explore/Assistant 入口和 `/api/post` 示例请求。 |
| `/explore`   | `src/app/(protected)/(tabs)/explore.tsx`      | Explore tab，展示 Expo Starter 的路由、平台、图片、主题和动画说明。                |
| `/assistant` | `src/app/(protected)/assistant.tsx`           | 受保护的 AI 对话页面，接入 assistant-ui runtime 和天气工具 UI。                    |
| `/api/post`  | `src/app/api/post+api.ts`                     | API Route 示例，返回 `{ "hello": "world" }`。                                      |

登录态路由保护由 `src/components/app-stack.tsx` 统一控制：

- `isLoggedIn === true`：允许访问 `(protected)` 页面组。
- `isLoggedIn === false`：允许访问 `login`。
- 原生端会等待 zustand persist hydration 完成后隐藏 Splash Screen。

## Assistant 功能说明

Assistant 页面由以下模块组成：

- `src/app/(protected)/assistant.tsx`：页面入口，创建 assistant-ui runtime、注册工具集并渲染 `Thread`。
- `src/hooks/use-app-runtime.ts`：通过 `AssistantChatTransport` 指向 `http://localhost:3000/api/chat`。
- `src/components/assistant-ui/`：对话线程、消息、输入框、分支选择、操作栏和工具卡片 UI。
- `src/components/assistant-ui/tools.tsx`：注册两个 Open-Meteo 工具：
  - `geocode_location`：按城市/地点名称查询经纬度。
  - `weather_search`：根据经纬度查询当前天气和 5 日预报。

> 注意：仓库中目前只实现了 Assistant 客户端和工具 UI；`/api/chat` 服务端接口需要由本地服务或后续实现提供。如果直接打开 Assistant 页面但没有可用的 `http://localhost:3000/api/chat`，对话请求会失败。

## 环境要求

- Node.js：建议使用与当前 Expo/React Native 版本兼容的 LTS 版本。
- pnpm：项目包含 `pnpm-lock.yaml`，建议使用 pnpm 安装依赖。
- Expo CLI：可通过 `pnpm expo ...` 或 `pnpm start` 间接使用。
- iOS 构建：需要 macOS + Xcode。
- Android 构建：需要 Android Studio / Android SDK。

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm start
```

启动后可根据 Expo CLI 提示选择平台：

- 按 `i` 打开 iOS Simulator。
- 按 `a` 打开 Android Emulator。
- 按 `w` 打开 Web。
- 也可以使用下面的快捷命令。

### 3. 按平台运行

```bash
pnpm ios
pnpm android
pnpm web
```

或使用同义脚本：

```bash
pnpm run:ios
pnpm run:android
```

## 常用脚本

| 命令                                | 说明                                                                                         |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm start`                        | 启动 Expo 开发服务器。                                                                       |
| `pnpm web`                          | 以 Web 模式启动应用。                                                                        |
| `pnpm ios` / `pnpm run:ios`         | 运行 iOS 原生项目。                                                                          |
| `pnpm android` / `pnpm run:android` | 运行 Android 原生项目。                                                                      |
| `pnpm prebuild`                     | 执行 `expo prebuild --clean`，重新生成原生工程。                                             |
| `pnpm lint`                         | 运行 Expo lint。                                                                             |
| `pnpm reset-project`                | package.json 中声明了该脚本，但当前仓库没有 `scripts/reset-project.js`，需要补齐后才能使用。 |

## 配置要点

### Expo 配置

`app.json` 中定义了应用名称、slug、版本、图标、scheme、平台包名和插件：

- iOS bundle identifier：`com.anonymous.expo-app`
- Android package：`com.anonymous.expoapp`
- Web output：`server`
- 插件：`expo-router`、`expo-splash-screen`、`expo-secure-store`
- 实验特性：`typedRoutes`、`reactCompiler`

### TypeScript 路径别名

`tsconfig.json` 启用 strict mode，并配置：

```json
{
  "@/*": ["./src/*"],
  "@/assets/*": ["./assets/*"]
}
```

因此项目中可以使用：

```ts
import { ThemedText } from "@/components";
import icon from "@/assets/images/icon.png";
```

### Uniwind / Tailwind

`metro.config.js` 使用 `withUniwindConfig` 包装默认 Metro 配置，并指定：

- CSS 入口：`./src/global.css`
- 类型声明输出：`./src/uniwind-types.d.ts`

`src/global.css` 定义了亮色/暗色主题 token，例如 `--color-background`、`--color-primary`、`--color-border` 等。

## 开发建议

1. **先实现真实登录逻辑**  
   当前登录页只是在本地 store 中切换 `isLoggedIn`，适合示例和原型。生产环境应接入真实身份认证、token 刷新和错误处理。

2. **补齐 Assistant 服务端接口**  
   如果需要完整 AI 对话能力，请实现 `POST /api/chat` 或把 `CHAT_API` 调整为真实后端地址。

3. **检查 `reset-project` 脚本**  
   `package.json` 中引用了 `./scripts/reset-project.js`，但仓库当前没有该文件。执行前应移除脚本或补齐脚本文件。

4. **按目标平台验证 UI**  
   项目包含原生 tabs、Web 专用组件、平台分支和安全区处理。涉及导航/布局改动时，建议至少验证 Web + 一个原生平台。

5. **谨慎执行 `prebuild`**  
   `pnpm prebuild` 会清理并重新生成 `ios/` 与 `android/` 目录；当前 `.gitignore` 已忽略这些生成目录。

## 故障排查

### Assistant 请求失败

确认 `src/hooks/use-app-runtime.ts` 中的 `CHAT_API` 指向可访问的服务：

```ts
const CHAT_API = "http://localhost:3000/api/chat";
```

如果在真机上运行，`localhost` 指的是手机本机，不是开发电脑。需要改成开发电脑在局域网中的 IP，或使用可访问的公网/内网后端地址。

### 登录态异常或页面不跳转

- Web：清理浏览器 `localStorage` 中的 `auth-store`。
- iOS / Android：清理应用数据，或卸载后重新安装。

### `pnpm reset-project` 报错

当前仓库没有 `scripts/reset-project.js`。请补齐该脚本，或从 `package.json` 中移除 `reset-project` 命令。

## License

本项目包含 `LICENSE` 文件，请以仓库中的授权条款为准。
