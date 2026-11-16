# 安徽邮电职业技术学院人工智能工作室网站 · 前端

本仓库包含工作室官网和内容管理后台。官网面向访客展示工作室介绍、企业项目、团队成员、竞赛、教研成果及平台设施。管理员登录后，可在后台维护展示内容、图片、排序与显示状态。

配套后端见 [studio-server](https://github.com/ahptcaistudio/studio-server)。

## 本地开发

使用 Node.js 24 和 npm。启动配套后端后，在前端仓库根目录执行：

```bash
npm ci
npm run dev
```

- 官网默认地址为 `http://localhost`，管理入口为 `/login`，登录后默认进入 `/studio/site`（基础设置）。没有该菜单权限的账号进入个人中心。
- Vite 将 `/dev-api` 请求转发到 `http://localhost:11236`。后端地址不同时，在 `.env.development.local` 中设置 `VITE_DEV_BACKEND_URL` 后重启 Vite。

## 构建与部署

```bash
npm run build:prod
```

构建产物位于 `dist/`，包括 `index.html`、JavaScript、CSS 和静态资源。推送代码后，GitHub Actions 会自动构建。在该次运行的 **Artifacts** 区域下载 `frontend-dist`，得到 `frontend-dist.zip`。

使用 [studio-server/deploy](https://github.com/ahptcaistudio/studio-server/tree/main/deploy) 提供的统一 Compose 配置与后端一起部署时：

1. 将 `dist/` 或下载的 ZIP 中的文件放入 `studio-server/deploy/web/`，确保 `index.html` 位于该目录下，并将后端 `ruoyi-admin.jar` 放入 `studio-server/deploy/`。
2. 将 `studio-server/deploy/.env.example` 复制为 `studio-server/deploy/.env`，配置数据库、Redis 与密钥（`BACKEND_URL` 默认使用同 Compose 网络的 `http://backend:11236`）。
3. 进入 `studio-server/deploy/` 并执行 `docker compose up -d` 即可一键启动前后端。

## 技术栈与许可

前端使用 Vue 3、Vite、Element Plus、Vue Router 和 Pinia，基于 RuoYi-Vue3 开发。许可见 [LICENSE](LICENSE)。
