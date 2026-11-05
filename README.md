# 安徽邮电职业技术学院人工智能工作室网站 · 前端

本仓库包含工作室官网和内容管理后台。官网面向访客展示工作室介绍、企业项目、团队成员、竞赛、教研成果及平台设施。管理员登录后，可在后台维护展示内容、图片、排序与显示状态。

配套后端见 [studio-server](https://github.com/ahptcaistudio/studio-server)。

## 本地开发

使用 Node.js 24 和 npm。启动配套后端后，在前端仓库根目录执行：

```bash
npm ci
npm run dev
```

- 官网默认地址为 `http://localhost`，管理后台入口为 `/admin`，登录页为 `/login`。
- Vite 将 `/dev-api` 请求转发到 `http://localhost:11236`。后端地址不同时，在 `.env.development.local` 中设置 `VITE_DEV_BACKEND_URL` 后重启 Vite。

## 构建与部署

```bash
npm run build:prod
```

构建产物位于 `dist/`，包括 `index.html`、JavaScript、CSS 和静态资源。推送代码后，GitHub Actions 会自动构建。在该次运行的 **Artifacts** 区域下载 `frontend-dist`，得到 `frontend-dist.zip`。

使用仓库提供的 Nginx Compose 配置部署时：

1. 将 `dist/` 或下载的 ZIP 中的文件放入 `deploy/web/`，确保 `index.html` 位于该目录下。
2. 将 [deploy/.env.example](deploy/.env.example) 复制为 `deploy/.env`，把 `BACKEND_URL` 设置为 Nginx 容器能够访问的后端地址，末尾不加斜杠。
3. 进入 `deploy/` 并执行 `docker compose up -d`。Nginx 默认监听 80 端口，并将 `/prod-api/` 请求转发给后端。

## 技术栈与许可

前端使用 Vue 3、Vite、Element Plus、Vue Router 和 Pinia，基于 RuoYi-Vue3 开发。许可见 [LICENSE](LICENSE)。
