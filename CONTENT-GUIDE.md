# 外贸展示站：内容配置说明

本网站为纯静态网站：页面、图片和 JSON 均为静态文件，运行时不需要后台服务、数据库或邮件服务。网站内容由 `resources` 文件夹管理。日常维护只需编辑 JSON、替换图片或复制商品文件夹，页面代码不用改。JSON = 用双引号、冒号和逗号记录文字与选项的配置文件。

当前品牌为 `NEXMER`，字标采用实心矢量几何字形、深色字母与红色 X。网站展示 6 件已配置正式中英文详情的商品，内容均由本地资源配置管理。网站默认英文，访客可点击导航中的“中文”手动切换；已手动选择的语言会在浏览器中保留。默认语言配置为 `defaultLanguage: "en"`。标签页首页标题由导航配置的 `siteTitle` 控制，当前为 `NEXMER｜AI Products from China`。

## 三个最常用的操作

1. **改文字或图片**：找到下表对应的 `config.json`，修改双引号内的文字；图片放进同级 `images` 文件夹，再把 `image` 或 `background` 填成 `images/文件名.webp`。中英文分别写在 `zh` 和 `en` 中，也支持只填一个文字字符串。
2. **加商品、改主推、增减详情图文**：复制 `resources/products/catalog/ai-smart-glasses`，将文件夹改名为小写英文名称，例如 `wireless-earbuds`，再修改配置和图片。若需要主推，复制一个 `featured` 子文件夹，把 `productId` 改成 `wireless-earbuds`。详情图片放在该商品的 `details/images`，图片和文字顺序由 `details/config.json` 的 `blocks` 数组决定。
3. **更新网站**：资源修改后需要重新构建并发布。开发预览期间，文件修改会自动同步。已发布站点的服务器不能直接枚举你电脑上的文件夹，因此新增文件不会只靠刷新网页上线。

## 配置位置

所有路径均相对于项目根目录。

| 内容 | 配置文件 | 图片位置 |
| --- | --- | --- |
| 品牌、网站标题、导航标题、默认语言、导航背景 | `resources/navigation/config.json` | `resources/navigation/images` |
| 认识我们：标题、两句介绍、首屏图和背景 | `resources/about/config.json` | `resources/about/images` |
| 主推模块标题、描述、查看更多、详情按钮、背景 | `resources/products/config.json` | `resources/products/images` |
| 每件主推商品：对应商品及封面/文字覆盖 | `resources/products/featured/01-ai-smart-glasses/config.json` | 对应子文件夹的 `images` |
| 智能电子、家居生活、香氛美妆、时尚与文化及目录全部筛选 | `resources/products/categories/config.json` | `resources/products/categories/images` |
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
  "image": "images/cover.webp"
}
```

分类值使用 `electronics`（智能电子 / Smart Electronics）、`home-living`（家居生活 / Home & Living）、`fragrance-beauty`（香氛美妆 / Fragrance & Beauty）或 `clothing`（时尚与文化 / Fashion & Culture）。electronics 和 clothing 保留旧标识，使已有分类链接继续可用。新增分类时在分类 JSON 的 `items` 数组加一项，再将商品的 `category` 填成同样的 `id`。`all` 自动包含所有启用的商品。未配置的默认分类继续展示。

主推配置只需写：

```json
{
  "enabled": true,
  "productId": "wireless-earbuds",
  "image": "images/cover.webp"
}
```

主推数量等于 `featured` 中启用、有效的子文件夹数量，没有写死上限；目前为 6 个。未放置任何主推文件夹时，默认展示目录前 3 件。`enabled: false` 可临时隐藏商品或主推；删除所有目录商品文件夹会恢复默认示例商品，若希望真正清空目录，请保留原目录并将所有商品设为 `enabled: false`。

首页主推与分类列表共用同一张商品卡片，整张卡片均可进入详情页。

### 暂时下架未配置正式详情的商品

以下商品已设置 `enabled: false`，不会出现在首页、商品目录、分类数量和详情页面中。原配置与图片保留，方便补齐详情后恢复。

| 商品 | 目录配置 | 首页主推配置 |
| --- | --- | --- |
| AI 陪伴机器人 | `resources/products/catalog/ai-companion-robot/config.json` | `resources/products/featured/02-ai-companion-robot/config.json` |
| 日常服装精选 | `resources/products/catalog/everyday-apparel/config.json` | 无 |
| 旅行收纳包 | `resources/products/catalog/travel-organizer/config.json` | 无 |

恢复时先补齐对应商品的 `details/config.json` 与图片，再将目录配置中的 `enabled` 改为 `true`。AI 陪伴机器人若要同时回到首页，还需启用其主推配置。重新构建并发布后生效。


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

## 中英文详情图片与无缝拼接

图片块的 `image` 既支持原来的单个路径（两种语言共用），也支持中英文分别配置。台灯现已使用 8 个图片块，每块配对中文与英文原图：

```json
{
  "layout": "seamless",
  "blocks": [
    {
      "type": "image",
      "image": { "zh": "images/zh/01.png", "en": "images/en/01.png" },
      "alt": { "zh": "逐光者产品介绍", "en": "Light Seeker product overview" }
    },
    {
      "type": "image",
      "image": { "zh": "images/zh/02.png", "en": "images/en/02.png" },
      "alt": { "zh": "AI 自适应照明", "en": "AI adaptive lighting" }
    }
  ]
}
```

`layout: "seamless"` 取消图片之间的间距、圆角和覆盖序号，按原始比例从上到下连续拼接；省略该字段或填写 `spaced` 继续使用有间距的图文布局。新增文字块仍然可用。点击详情图打开当前语言原图，手动切换语言时当前页全部图片一起切换。

每个语言路径均相对于当前详情文件夹，图片分别存放在 `details/images/en` 和 `details/images/zh`。文件夹内均有 `图片要求.md`。某种语言未配置或文件缺失时先使用另一种可用语言图片，再回退至商品封面。路径错误、未知语言键和错误类型会在构建时指出具体块与语言字段。

台灯商品名称、简介和封面均已写入 `products/catalog/ai-smart-lamp/config.json` 和 `products/featured/03-ai-smart-lamp/config.json`。两处分别控制目录卡片与首页主推卡片；需要同时修改文案时请同步编辑这两个配置。8 张图以画面中的模块 01–08 排序；原附件文件名与模块的对应关系见台灯 `details/README.md`。

## 中国文旦柚香氛

商品目录配置为 `resources/products/catalog/wendan-pomelo-fragrance/config.json`；首页主推配置为 `resources/products/featured/04-wendan-pomelo-fragrance/config.json`。两处均明确写入中英文名称、关键描述、标签与封面。商品归在“香氛美妆”，英文名称为 Wendan Pomelo Fragrance，香型为赤柚香韵（Crimson Pomelo X）和青柚花语（Jade Pomelo Bloom）。

详情文件为该商品的 `details/config.json`，中英文分别位于 `details/images/zh` 和 `details/images/en`，当前为各 7 张，按 01–07 原图无间距排列。此次附件没有第 8 张；后续添加时，复制一个图片块并分别填写 `images/zh/08.png` 与 `images/en/08.png` 即可。原图片完整保留，按同一宽度等比例展示。

首页当前有 6 件主推商品，桌面端每行3张、中等屏幕每行2张、手机每行1张；数量仍由启用的主推子文件夹控制。按品类探索位于精选产品之前，顶部产品导航定位至分类模块。

## 中国盛唐汉服的双语详情与卡片

商品名称为中国盛唐汉服 / Tang Dynasty Mural-Inspired Ramie Hanfu，归入时尚与文化。目录配置为 `resources/products/catalog/tang-dynasty-ramie-hanfu/config.json`；首页主推配置为 `resources/products/featured/05-tang-dynasty-ramie-hanfu/config.json`。两处均明确写入中英文名称、简介、标签及 `images/hanfu-cover.png` 封面。

该商品 `details/config.json` 使用 `layout: "seamless"`，将中英文各 8 张原图配置为 8 个双语图片块。原图位于 `details/images/zh/01.png`–`08.png` 和 `details/images/en/01.png`–`08.png`，两组分别遵循上传附件的数字编号。中英文的尺码与模特展示模块排序不同，不能按另一种语言的主题重排。完整原文件名和内容对应表见该商品 `details/README.md`。

卡片介绍来自详情图中的苎麻面料、轻薄透气、赤陶红与黛青撞色、团花纹样、宽袖系带及 S / M / L / XL 尺码。修改首页和目录文案时请同步修改两处配置。卡片封面提取自中文详情首图；详情仍使用未经修改的 16 张原图。

## 首页彩色科技首屏图

首屏图片由 `resources/about/config.json` 的 `image: "images/hero-ai-collection.png"` 控制，原文件在 `resources/about/images`。以银色 AI 台灯、黑色 AI 眼镜和白色陪伴机器人组成黑红科技场景。`imageAlt` 配置双语替代文字，`imageLabel` 和 `imageCaption` 控制图片上的双语标题与说明。

推荐近方形横图，至少 1400 px 宽；核心产品放在中央安全区，底部留少量暗色空白，避免压住网页自带的白色说明文字。图片中无需另加品牌或标题，各屏幕按约 1.14:1 展示，以保留完整的三件产品。


## 默认值与错误处理

JSON 字段没填、模块配置文件没放、图片找不到时，使用内置文案或默认图片。JSON 格式错误会在构建时提示具体文件，避免发布损坏内容。图片路径必须指向当前资源子文件夹，使用 `images/hero.webp` 这种相对路径。

中英文换行使用 `\n`。JSON 不能写注释，最后一个字段后不能加逗号。浏览器读取实际模块 JSON；构建同时生成目录清单 `public/resources/index.json` 和首屏内容快照 `generated/content.json`，这两个文件自动生成，无需手改。`public/resources` 是发布用副本，日常请修改根目录的 `resources`。

## 联系信息

在 `resources/support/config.json` 填写 `email` 和 `whatsapp`，`contactTitle` 可修改“联系信息”标题。

点击 Email 会通过 `mailto:` 打开访客自己的邮件客户端，由访客编辑并发送邮件；点击 WhatsApp 会打开对应联系页面。WhatsApp 请填完整国际号码，网站自动生成 `wa.me` 链接。当前邮箱为 `maje.nexmer@gmail.com`。WhatsApp 使用 `whatsappQrImage: "images/whatsapp-qr.svg"` 展示上传的联系二维码，`whatsappQrLabel` 与 `whatsappQrAlt` 分别控制中英文说明和替代文字。未填的联系渠道不显示。

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

品牌名在 `resources/navigation/config.json` 的 `brand` 字段中配置，当前为 `NEXMER`；`logo` 为 `images/nexmer-wordmark-vector.svg`，同一个完整字标用于导航和页脚。字标由实心矢量路径构成，不含放大的位图、描边或颜色滤镜。替换时推荐使用透明背景的横版 PNG 或 SVG，保留字标周围少量留白。没有配置图片时，默认显示红色 X 的 NEXMER 文字字标。网站页面不再展示样稿标记、示意图图注或未配置渠道的待补充提示。

主题在 `app/globals.css` 第一行的变量中集中定义：`--ink: #181818` 为炭黑，`--accent: #c62828` 为深红，`--accent-dark: #a51f1f` 为按钮悬停色，`--paper: #ffffff` 为白色背景。红色用于主按钮、导航与分类选中态、图标和重点标题；图片内容仍由对应资源文件配置。标签页图标为 `public/favicon.svg` 的红色 X。

## 彩色图片与缺图回退

Banner、商品封面、详情图与分类图片均保留原始色彩。黑红配色用于界面，不对商品照片添加灰度滤镜。

当前展示的六件商品均包含彩色封面与正式中英文详情图。未配置封面或配置文件中的图片不存在时，优先使用对应示例商品的默认照片；新增商品按智能电子、家居生活、香氛美妆、时尚与文化选择内置照片。浏览器加载图片失败时，也会依次尝试商品封面、匹配的默认照片和通用彩色集合图。

内置照片位于 `public/defaults`：`glasses.webp`（眼镜 / 电子产品）、`robot.webp`（机器人）、`lamp.webp`（台灯）、`clothing.webp`（服装）、`travel.webp`（收纳包 / 家居生活）、`hero.webp`（通用集合图）。新增分类回退照片为 `toaster.jpg`（家居生活）、`pomelo-fragrance.png`（香氛美妆）、`hanfu.jpg`（时尚与文化）。这些文件随静态成品一起发布；可以用同名文件替换，再重新构建。


## 四大一级分类与分类缩略图

首页只展示四大分类卡片；“全部 / All products”保留在商品目录的筛选栏和“查看更多”入口。配置位置为 `resources/products/categories/config.json`。

| 中文名称 | 英文名称 | id | 分类图片 |
| --- | --- | --- | --- |
| 智能电子 | Smart Electronics | electronics | images/smart-electronics.png，台灯详情提取封面 |
| 家居生活 | Home & Living | home-living | images/home-living.jpg，上传的烤面包机照片 |
| 香氛美妆 | Fragrance & Beauty | fragrance-beauty | images/fragrance-beauty.png，文旦柚香氛详情提取封面 |
| 时尚与文化 | Fashion & Culture | clothing | images/fashion-culture.jpg，上传的汉服照片 |

商品归类由每件商品 config.json 的 category 控制：三件AI产品（眼镜、台灯、毛绒陪伴宠物）归智能电子、DT088多士炉归家居生活、文旦柚香氛归香氛美妆、中国盛唐汉服归时尚与文化。主推卡片自动继承目录商品分类。

分类图片的 `imagePosition` 使用两个0%–100%的百分比，先水平后垂直，例如 `"50% 0%"` 为水平居中、顶部对齐，适合保留汉服照片的人物头部。其他三张为 `"50% 50%"` 居中。图片原文件不变，只调整网页显示取景。分类图片缺失时使用对应内置照片；未识别的商品分类回退到家居生活。


## DT088 双槽多士炉：双语详情与商品卡片

商品名称为 DT088 双槽多士炉 / DT088 2-Slice Toaster，归入家居生活（home-living）。目录配置为 `resources/products/catalog/dt088-toaster/config.json`；首页精选配置为 `resources/products/featured/06-dt088-toaster/config.json`。两处均明确写入中英文名称、简介、标签和 `images/dt088-toaster-cover.png`，封面从中文详情首图提取。

该商品 `details/config.json` 使用 `layout: "seamless"`，中英文分别存放在 `details/images/zh/01.png`–`04.png` 和 `details/images/en/01.png`–`04.png`。上传全局编号1–4为中文，5–8为英文；英文5、6、7、8分别对应英文模块1、2、3、4。8张详情原图未经修改，按每组01–04依次无间距竖排。原文件对应表见该商品 `details/README.md`。

卡片卖点来自详情图：双槽设计、7档烘烤、解冻、再加热、一键停止、独立控制杆及抽出式集屑盘。修改两处配置可分别管理首页和目录；切换语言会同时切换商品文字和4张详情图片。


## AI 陪伴宠物：双语详情与商品卡片

商品名称为AI 陪伴宠物 / AI Companion Pet，归入智能电子（electronics）。目录配置为 `resources/products/catalog/ai-companion-pet/config.json`；首页精选配置为 `resources/products/featured/07-ai-companion-pet/config.json`。两处均明确写入中英文名称、简介、标签与 `images/ai-companion-pet-cover.png` 封面。卡片卖点来自详情图中的柔软毛绒、发光蓝眼、便携编织挂绳和桌面、出行、送礼场景。

详情配置为该商品 `details/config.json`，使用 `layout: "seamless"`；中文与英文图片分别位于 `details/images/zh/01.png`–`05.png` 和 `details/images/en/01.png`–`05.png`。上传编号1–5为中文、6–10为英文，两组各按模块1–5无间距竖排。默认英文，切换中文后会更换整组5张图片。所有10张详情原图完整保留，原文件名与模块对应表见 `details/README.md`。

封面从中文首图提取，首页和目录各存一份相同图片。图片尺寸说明保存在每个images目录及语言子目录的 `图片要求.md`。修改文案时同步编辑首页和目录两份配置。


## AG18 AI 智能眼镜：更新既有商品

沿用商品id `ai-smart-glasses` 和详情地址 `/products/ai-smart-glasses`，目录与首页主推数量不变。目录配置为 `resources/products/catalog/ai-smart-glasses/config.json`；首页配置为 `resources/products/featured/01-ai-smart-glasses/config.json`。两处均明确写入名称 AI 智能眼镜 AG18 / AI Smart Glasses AG18、双语简介、标签及 `images/ag18-glasses-cover.png` 封面。

简介取自详情图中的第一视角拍摄、实时翻译、AI智能问答、智能笔记与开放式音频，以及通勤、旅行和日常交流场景。封面从中文首图中的独立眼镜产品提取，保留镜框、镜头、状态灯及湖山背景，去除人物与叠加文字。

详情由该商品 `details/config.json` 的5个双语图片块控制，`layout: "seamless"`。中文位于 `details/images/zh/01.png`–`05.png`，英文位于 `details/images/en/01.png`–`05.png`。上传编号1–5为中文、6–10为英文，每组依次对应模块1–5，无间距竖排；10张详情原图均完整保留。切换语言时同时切换名称、简介和全部5张详情图。原文件映射与图片尺寸要求见详情README及各images文件夹。
