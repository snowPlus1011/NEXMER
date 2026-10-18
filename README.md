# NEXMER 纯静态外贸商品展示站

中英文单页首页、分类商品目录、竖排图文详情和 Email / WhatsApp 联系入口。所有内容由 `resources/` 中的本地 JSON、商品子文件夹与图片配置，没有询盘表单、邮件接口、后台、数据库或云函数。

日常维护请阅读 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)。每件商品的 `details/config.json` 使用 `blocks` 数组配置图片与文字，详情图片放在 `details/images/`；增删或移动块即可调整数量与顺序。

## 使用源码

Node.js ≥ 22.13，pnpm 11.25.0：

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

本地预览：http://127.0.0.1:5173。修改 `resources` 会自动同步并刷新。

## 生成静态成品

```bash
pnpm run check
pnpm run build
pnpm run check:dist
pnpm run start
```

成品预览：http://127.0.0.1:4173。把 `dist` 内所有文件上传到网站根目录即可；服务器仅需提供静态文件，不需要安装 Node 或 pnpm。首页、目录和每件商品都已生成独立 HTML。

只有成品文件时，可用 `python3 -m http.server 8080 --directory dist` 在 http://127.0.0.1:8080 查看。通过 HTTP 访问，双击 HTML 的 `file://` 模式会受到浏览器 JSON 与模块加载限制。

当前品牌、5 件商品及图片为可替换样稿；在 `resources/support/config.json` 填写真实 Email 和 WhatsApp。Email 链接只打开访客的邮件客户端，网站自身不发送邮件。
