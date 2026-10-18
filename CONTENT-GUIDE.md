# 外贸展示站：内容配置说明

本网站为纯静态网站：页面、图片和 JSON 均为静态文件，运行时不需要后台服务、数据库或邮件服务。网站内容由 `resources` 文件夹管理。日常维护只需编辑 JSON、替换图片或复制商品文件夹，页面代码不用改。JSON = 用双引号、冒号和逗号记录文字与选项的配置文件。

当前品牌为 `NEXMER`，字标采用黑色字母与红色 X。5 件商品和 AI 生成商品图为可替换样稿；上线前请填写真实商品资料和联系方式。首页默认中文，可切换英文；默认语言可改成 `en`。

## 三个最常用的操作

1. **改文字或图片**：找到下表对应的 `config.json`，修改双引号内的文字；图片放进同级 `images` 文件夹，再把 `image` 或 `background` 填成 `images/文件名.webp`。中英文分别写在 `zh` 和 `en` 中，也支持只填一个文字字符串。
2. **加商品、改主推、增减详情图文**：复制 `resources/products/catalog/ai-smart-glasses`，将文件夹改名为小写英文名称，例如 `wireless-earbuds`，再修改配置和图片。若需要主推，复制一个 `featured` 子文件夹，把 `productId` 改成 `wireless-earbuds`。详情图片放在该商品的 `details/images`，图片和文字顺序由 `details/config.json` 的 `blocks` 数组决定。
3. **更新网站**：资源修改后需要重新构建并发布。开发预览期间，文件修改会自动同步。已发布站点的服务器不能直接枚举你电脑上的文件夹，因此新增文件不会只靠刷新网页上线。

## 配置位置

所有路径均相对于项目根目录。

| 内容 | 配置文件 | 图片位置 |
| --- | --- | --- |
| 品牌、导航标题、默认语言、导航背景 | `resources/navigation/config.json` | `resources/navigation/images` |
| 认识我们：标题、两句介绍、首屏图和背景 | `resources/about/config.json` | `resources/about/images` |
| 主推模块标题、描述、查看更多、详情按钮、背景 | `resources/products/config.json` | `resources/products/images` |
| 每件主推商品：对应商品及封面/文字覆盖 | `resources/products/featured/01-ai-smart-glasses/config.json` | 对应子文件夹的 `images` |
| 全部、电子产品、服装、其他及新增分类 | `resources/products/categories/config.json` | `resources/products/categories/images` |
| 每件商品：名称、描述、分类、标签、封面 | `resources/products/catalog/ai-smart-glasses/config.json` | 对应子文件夹的 `images` |
| 每件商品的竖排图文详情 | 对应商品子文件夹的 `details/config.json` | 对应详情文件夹的 `images`，即商品的 `details/images` |
| 服务与支持：联系信息、标题、文案、背景 | `resources/support/config.json` | `resources/support/images` |

每个图片文件夹都有 `图片要求.md`，写明建议尺寸、比例、格式和大小。照片支持 WebP、JPG、JPEG、PNG、AVIF；SVG 可用于已有图形资源。

## 商品配置示例

下面是可直接使用的 `resources/products/catalog/wireless-earbuds/config.json`。该目录名也就是商品页面地址 `/products/wireless-earbuds`。

```json
{
  "enabled": true,
  "category": "electronics",
  "name": { "zh": "无线耳机", "en": "Wireless Earbuds" },
  "summary": { "zh": "欢迎联系我们了解规格与采购信息。", "en": "Contact us for specifications and sourcing information." },
  "tag": { "zh": "智能音频", "en": "SMART AUDIO" },
  "image": "images/cover.webp",
  "sample": false
}
```

分类值默认使用 `electronics`（电子产品）、`clothing`（服装）或 `other`（其他）。新增分类时在分类 JSON 的 `items` 数组加一项，再将商品的 `category` 填成同样的 `id`。`all` 自动包含所有启用的商品。未配置的默认分类继续展示。

主推配置只需写：

```json
{
  "enabled": true,
  "productId": "wireless-earbuds",
  "image": "images/cover.webp"
}
```

主推数量等于 `featured` 中启用、有效的子文件夹数量，没有写死上限；目前为 3 个。未放置任何主推文件夹时，默认展示目录前 3 件。`enabled: false` 可临时隐藏商品或主推；删除所有目录商品文件夹会恢复默认示例商品，若希望真正清空目录，请保留原目录并将所有商品设为 `enabled: false`。

首页主推与分类列表共用同一张商品卡片，整张卡片均可进入详情页。

## 商品图文详情配置

每件商品有独立的详情文件夹。例如：

| 文件 | 用途 |
| --- | --- |
| `resources/products/catalog/wireless-earbuds/details/config.json` | 详情图片、标题、正文、图注及排列顺序 |
| `resources/products/catalog/wireless-earbuds/details/images/01.webp` | 详情图片，可按需添加多张 |
| `resources/products/catalog/wireless-earbuds/details/images/图片要求.md` | 图片尺寸、比例和压缩建议 |

下面的配置展示“图片 → 文字 → 图片 → 文字”。两张图片需放入上述详情图片文件夹：

```json
{
  "blocks": [
    {
      "type": "image",
      "image": "images/01.webp",
      "alt": { "zh": "无线耳机外观", "en": "Wireless earbuds exterior" },
      "caption": { "zh": "外观展示", "en": "Product overview" }
    },
    {
      "type": "text",
      "title": { "zh": "商品介绍", "en": "About this product" },
      "body": {
        "zh": "在这里填写真实的商品介绍。\n\n这里可继续填写下一段说明。",
        "en": "Add your actual product description here.\n\nContinue with another paragraph here."
      }
    },
    {
      "type": "image",
      "image": "images/02.webp",
      "alt": "商品细节"
    },
    {
      "type": "text",
      "title": "采购信息",
      "body": "在这里填写可提供的款式、包装或其他采购信息。"
    }
  ]
}
```

- `blocks` 内从上到下的顺序，就是详情页竖排展示顺序；复制、删除或移动一整个块即可增减和排序，没有固定数量上限。可连续放置多张图片或多段文字，也支持纯文字详情。
- 图片块的 `type` 为 `image`，`image` 相对于当前详情文件夹，使用 `images/01.webp`。`alt` 是图片替代文字，未填时使用商品名称；`caption` 是图片下方的图注，选填。未被 JSON 引用的图片不会显示。
- 文字块的 `type` 为 `text`，`title` 和 `body` 至少填写一个。文字支持中英文对象或直接填写一个字符串；只填一种语言时，切换语言仍能展示该文字。`\n` 换行、`\n\n` 分段，页面按普通文字展示，无需 HTML。
- 图片保持原始比例，文字自动换行，手机端同样按顺序向下滚动。页面显示的是图文块总数，图片上的序号单独按图片数量计算。

未放置详情 JSON、未填写 `blocks` 或数组为空时，自动按数字文件名顺序展示 `details/images` 内的图片；也兼容原来的 `images/details` 文件夹。没有可用的详情内容时展示封面，封面缺失则使用默认图。JSON 中某张图片缺失时保留该位置和图注，并展示商品封面或默认图。

## 默认值与错误处理

JSON 字段没填、模块配置文件没放、图片找不到时，使用内置文案或默认图片。JSON 格式错误会在构建时提示具体文件，避免发布损坏内容。图片路径必须指向当前资源子文件夹，使用 `images/hero.webp` 这种相对路径。

中英文换行使用 `\n`。JSON 不能写注释，最后一个字段后不能加逗号。浏览器读取实际模块 JSON；构建同时生成目录清单 `public/resources/index.json` 和首屏内容快照 `generated/content.json`，这两个文件自动生成，无需手改。`public/resources` 是发布用副本，日常请修改根目录的 `resources`。

## 联系信息

在 `resources/support/config.json` 填写 `email` 和 `whatsapp`，`contactTitle` 可修改“联系信息”标题。

点击 Email 会通过 `mailto:` 打开访客自己的邮件客户端，由访客编辑并发送邮件；点击 WhatsApp 会打开对应联系页面。WhatsApp 请填完整国际号码，网站自动生成 `wa.me` 链接。未填联系方式时展示“联系方式待补充”。当前样稿的联系方式仍为空，请填写自己的真实信息。

网站不提供在线填表、不保存访客资料、不调用自动邮件接口，也不需要 API 密钥或部署环境变量。

## 本地运行与生成静态文件

开发工具使用 Node.js 22.13 或更新版本和 pnpm 11.25.0。React = 浏览器页面组件库；Vite = 把页面代码打包为静态 JavaScript、CSS 的本地工具。这些工具仅用于编辑、检查和构建，部署后的服务器只需提供静态文件。

第一次使用源码时安装锁文件对应依赖，然后启动本地预览：

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

本地地址为 `http://127.0.0.1:5173`。开发模式监听 `resources` 中的文字、图片及文件夹增删，修改后会同步并刷新页面。

发布或更新成品：修改 `resources` → 构建 → 替换静态文件。

```bash
pnpm run check
pnpm run build
pnpm run check:dist
```

构建产物全部位于 `dist`，包括首页 `index.html`、商品目录 `products/index.html`、每件商品 `products/商品文件夹名称/index.html`、`404.html`、图片、JSON 和本地打包的 JavaScript/CSS。每个商品有独立 HTML，直接进入详情链接或刷新不依赖后台路由。构建会清空旧输出，已删除或停用的商品不会遗留旧详情页。

本地查看构建成品：

```bash
pnpm run start
```

地址为 `http://127.0.0.1:4173`。只有成品文件、未安装 Node 工具时，也可以使用 Python 的静态文件服务：

```bash
python3 -m http.server 8080 --directory dist
```

地址为 `http://127.0.0.1:8080`。请通过静态文件服务访问，而不是双击 HTML；浏览器会限制 `file://` 读取 JSON 和脚本模块。

## 部署

把 **dist 内的全部文件和文件夹** 原样上传到任意静态网站空间或服务器的网站根目录，根目录应直接包含 `index.html`、`products`、`resources` 和 `assets`。站点使用从根目录开始的资源地址，默认部署在域名根路径；不需要 Node 常驻进程、云函数、数据库、第三方邮件账户或 CDN 脚本。

静态空间需支持目录下的 `index.html`，例如 `/products/ai-smart-glasses/` 对应 `products/ai-smart-glasses/index.html`。未知地址使用 `404.html`。在本地 JSON 中修改内容之后，重新构建并替换静态成品；仅修改电脑里的文件不会自动更新已上传的网站。

`.openai/hosting.json` 只用于保留当前预览站点身份，已声明 `dist` 为静态产物；网站运行代码不读取它，部署到其他静态空间时也不需要它。当前在线审阅站点保留原有访问范围。

## NEXMER 品牌与配色

品牌名在 `resources/navigation/config.json` 的 `brand` 字段中配置，当前为 `NEXMER`；`logo` 为 `images/nexmer-logo-red-x.png`，同一个完整字标用于导航和页脚。替换时推荐使用透明背景的横版 PNG 或 SVG，保留字标周围少量留白。没有配置图片时，默认显示红色 X 的 NEXMER 文字字标。

主题在 `app/globals.css` 第一行的变量中集中定义：`--ink: #181818` 为炭黑，`--accent: #c62828` 为深红，`--accent-dark: #a51f1f` 为按钮悬停色，`--paper: #ffffff` 为白色背景。红色用于主按钮、导航与分类选中态、图标和重点标题；图片内容仍由对应资源文件配置。标签页图标为 `public/favicon.svg` 的红色 X。

## 彩色图片与缺图回退

Banner、商品封面、详情图与分类图片均保留原始色彩。黑红配色用于界面，不对商品照片添加灰度滤镜。

五件示例商品均包含彩色封面与详情图。未配置封面或配置文件中的图片不存在时，优先使用对应示例商品的默认照片；新增商品按电子产品、服装、其他选择内置彩色默认照片。浏览器加载图片失败时，也会依次尝试商品封面、匹配的默认照片和通用彩色集合图。

内置照片位于 `public/defaults`：`glasses.webp`（眼镜 / 电子产品）、`robot.webp`（机器人）、`lamp.webp`（台灯）、`clothing.webp`（服装）、`travel.webp`（收纳包 / 其他）、`hero.webp`（通用集合图）。这些文件随静态成品一起发布；可以用同名文件替换，再重新构建。
