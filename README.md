# NEXMER 纯静态外贸商品展示站

默认英文的中英文单页首页、分类商品目录、竖排图文详情和 Email / WhatsApp 联系入口。首页标签页标题为 `NEXMER｜AI Products from China`，访客可手动切换中文。所有内容由 `resources/` 中的本地 JSON、商品子文件夹与图片配置，没有询盘表单、邮件接口、后台、数据库或云函数。

日常维护请阅读 [CONTENT-GUIDE.md](CONTENT-GUIDE.md)。每件商品的 `details/config.json` 使用 `blocks` 数组配置图片与文字，详情图片放在 `details/images/`；增删或移动块即可调整数量与顺序。图片支持 `image: { "en": "images/en/01.png", "zh": "images/zh/01.png" }`；`layout: "seamless"` 可无间距拼接。逐光者台灯已配置中英文各 8 张原图，首页与目录配置也已同步名称、卖点和新封面。中国文旦柚香氛已配置中英文各 7 张详情图；中国盛唐汉服已配置中英文各 8 张原图，名称、苎麻面料与撞色宽袖等卖点、提取封面均分别写入首页和目录配置。DT088 双槽多士炉已配置中英文各 4 张原图和同一套卡片名称、简介与提取封面。AI 陪伴宠物已配置中英文各 5 张原图，名称、毛绒与发光蓝眼等卖点、提取封面已同步首页和目录。AG18 AI 智能眼镜已更新为中英文各5张原图，并同步首页、目录的双语名称、核心功能与新封面。当前目录与首页主推均为 6 件已配置正式中英文详情的商品。AI 陪伴机器人、日常服装精选和旅行收纳包已通过 `enabled: false` 暂时下架，配置与素材保留，补齐详情后可重新启用。首页顺序为认识我们、按品类探索、精选产品、服务与支持。首屏使用 AI 台灯、眼镜与陪伴机器人的黑红彩色科技集合图。

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

当前联系邮箱为 `maje.nexmer@gmail.com`，WhatsApp 二维码位于 `resources/support/images/whatsapp-qr.svg`，均由 `resources/support/config.json` 配置。导航和页脚统一使用重新绘制的实心矢量 NEXMER 字标，保留几何字形与红色 X，不含位图、描边和滤镜。Email 链接只打开访客的邮件客户端，网站自身不发送邮件。

一级分类为 Smart Electronics（智能电子）、Home & Living（家居生活）、Fragrance & Beauty（香氛美妆）、Fashion & Culture（时尚与文化）；首页展示4张分类卡片，目录保留All products筛选。分类缩略图依次使用台灯、烤面包机、文旦柚香氛和汉服，由分类JSON统一配置。
