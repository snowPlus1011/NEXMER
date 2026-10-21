# 示例图像记录

方式：内置 imagegen 工具，product-mockup 类型；全部为未绑定真实型号的展示概念图。原图保留，通过 ImageMagick 转换为 WebP，仅压缩用于网页的文件。商品配置 `sample: true` 显示示意标记。

| 图像 | 项目内完整路径 |
| --- | --- |
| 首屏集合图 | `/workspace/sites/NEXMER/public/defaults/hero.webp` |
| AI 眼镜 | `/workspace/sites/NEXMER/public/defaults/glasses.webp` |
| AI 陪伴机器人 | `/workspace/sites/NEXMER/public/defaults/robot.webp` |
| AI 台灯 | `/workspace/sites/NEXMER/public/defaults/lamp.webp` |
| 服装 | `/workspace/sites/NEXMER/public/defaults/clothing.webp` |
| 收纳包 | `/workspace/sites/NEXMER/public/defaults/travel.webp` |

这些图同时复制到对应 `resources` 模块，替换方法见 `CONTENT-GUIDE.md`。

## 生成提示词

**Hero**

Use case: product-mockup. Asset type: a wide hero photograph for an elegant export product catalog. A beautifully composed tabletop still life with unbranded matte-black AI smart glasses in foreground left, a small friendly ivory desk companion robot with a glossy black oval face screen and two softly illuminated cyan eyes in center, and a slender ivory modern desk lamp at rear right. They sit on low pale travertine platforms in a warm off-white architectural studio; soft sage green background, subtle plant shadow from sunlight, no plants covering products. Sophisticated magazine-quality product photography, soft natural side light, tactile materials, long gentle shadows, lots of breathing room. Landscape 3:2 frame, all products visible and sharp, no text, no logos, no watermark. The objects are illustrative design concepts, not real branded products.

**Glasses**

Use case: product-mockup. Asset type: square product catalog photo. A single pair of sophisticated unbranded matte charcoal-black AI smart eyeglasses with discreet thick temples and clear subtly tinted lenses, three-quarter view resting diagonally on a warm ivory matte surface. Minimal refined commercial product photography, softly lit pale warm-gray studio background, photoreal material, graceful shadow, perfectly centered whole object with generous breathing room. No text, no logo, no watermark. Illustrative unbranded product concept.

**Robot**

Use case: product-mockup. Asset type: square product catalog photo. A small unbranded AI desk companion robot, rounded ivory egg-shaped body, glossy black oval face display with two small cute softly glowing mint-blue eyes, two short rounded feet, subtle brushed finish and faint coral cheek lights. Standing on a warm light stone platform. Three-quarter front view, serene pale ivory studio background, sophisticated premium product photography with soft side light, full object with generous margins. No text, no logos, no watermark. Illustrative concept, not a named real product.

**Lamp**

Use case: product-mockup. Asset type: square product catalog photo. A minimalist unbranded intelligent desk lamp in off-white aluminum with circular base, a thin vertical stalk, and a slim capsule-shaped horizontal light head, soft warm light illuminating its base. Three-quarter view, sophisticated commercial product photography on pale warm gray seamless backdrop, very subtle studio shadows, centered entire lamp including full base with generous margins. No text, no logos, no watermark. Illustrative product concept.

**Clothing**

Use case: product-mockup. Asset type: square apparel product catalog photo. A beautifully folded cream oversized unbranded cotton T-shirt resting on a sage green linen surface, with a small part of its crew-neck and sleeves clearly visible; one sand-colored cotton shirt folded behind it. Premium fabric texture, neat merchandising still life, soft natural daylight, ivory and beige palette, top-down slightly angled shot, generous margins. No people, no text, no brands, no labels, no watermark. Product illustration for a sample wholesale clothing catalog.

**Travel**

Use case: product-mockup. Asset type: square catalog product photo. A single unbranded sage-gray compact fabric travel organizer pouch with a zipper and a neat carrying handle, closed with one zipped compartment visible, on a warm off-white tabletop. Elegant minimal commercial product photography, three-quarter angle, softly lit sage and ivory seamless studio, realistic woven textile texture and shadow, centered with generous breathing space. No text, no logos, no watermark. Illustrative product concept for an export catalog.

## NEXMER 黑红字标

编辑目标：用户提供的 NEXMER 黑色字标。使用内置 imagegen 编辑工具，只将第三个字母 X 改为深红，其他字母保留黑色；透明背景，保留几何造型和字距。

项目资源：`resources/navigation/images/nexmer-logo-red-x.png`。导航与页脚共用这一完整字标，替换方式见 `CONTENT-GUIDE.md`。

最终提示词：

Use case: precise-object-edit. Asset type: transparent website brand wordmark. Edit target: the supplied NEXMER black wordmark image. Recolor ONLY the complete third letter X (all of its existing separate strokes/arms) to solid deep red #C62828. Preserve the precise existing custom futuristic geometric shapes, cutouts, kerning, proportions and positions of all six letters N E X M E R. The N, E, M, E and R must remain solid charcoal black #181818. The X is the only red letter. Exact text NEXMER. Keep the wordmark sharp and flat, no gradients, texture, effects, shadows, outlines or extra symbols. Output with a genuinely transparent background. Frame the entire wordmark horizontally with only a small even transparent margin (about 4 percent) on all sides so it is ready for a website header. Do not redesign the lettering.


## 2026-10-20：逐光者 / Light Seeker

用户提供中英文各 8 张 PNG 切图，按画面右上角模块号 01–08 配对。原图直接复制至 `resources/products/catalog/ai-smart-lamp/details/images/en` 和 `zh`，未重绘、裁切或压缩。原文件名映射在 `details/README.md`。名称“逐光者 / Light Seeker”、品类“AI 智能自适应台灯 / AI Adaptive Desk Lamp”、实时感知、学习习惯、自适应亮度色温和 App 控制等描述均来自这些切图，已写入首页主推与商品目录配置。

卡片封面使用内置 image_gen 图像编辑工具，从中文模块 01 提取无文字的台灯场景。输出复制至 `resources/products/catalog/ai-smart-lamp/images/light-seeker-cover.png` 和 `resources/products/featured/03-ai-smart-lamp/images/light-seeker-cover.png`。未修改原上传文件。

最终提示词：

> Use case: precise-object-edit. Asset type: square e-commerce product card photograph for NEXMER. Edit target: the attached existing Light Seeker desk-lamp promotional image. Extract and reframe ONLY the existing silver desk lamp and its immediate desk environment into a clean, square product photograph. Keep the entire lamp visible, including the full illuminated horizontal cylindrical bar stretching left, the same joint and sensor near its right end, the same tall slender vertical silver stem with its small side knob, and the same round metallic base with black sidewall. Preserve the lamp's exact geometry, brushed silver material, warm light and black/red room lighting from the source; do not redesign or introduce any additional product. Bring the lamp to the center of a tightly framed square crop with modest breathing room, using the original warm desk and blurred dark interior with red accent lighting as backdrop. No typography, logos, icons, diagrams or captions anywhere. The final photo should feel extracted from the original scene, with the product completely visible and large enough for homepage and catalog cards.


## 2026-10-20：正式字标与联系二维码

网站字标直接取自用户提供的英文台灯模块 01 左上角 NEXMER 字样。最终使用 `resources/navigation/images/nexmer-product-wordmark.svg`：SVG 内嵌原 PNG，通过视窗保留原字形，再把白色字样映射为深色、单独将 X 映射为红色，适配白色导航与页脚。原字形未重新生成或改写；导航与页脚完整按比例显示。浏览器标签页图标同步使用细线红色 X。

联系二维码使用用户上传的 `JPEG图像-4A85-99AB-20-0.jpeg`。`resources/support/images/whatsapp-qr.svg` 内嵌完整原 JPEG 字节，仅通过视窗显示二维码及白边，保留原始二维码图案；未重绘二维码。邮箱为 `maje.nexmer@gmail.com`。二维码配置与两种语言说明位于 `resources/support/config.json`。


## 2026-10-20：字标清晰度修复与文旦柚香氛

最终字标改用 `resources/navigation/images/nexmer-wordmark-vector.svg`。NEXMER 六个字母均为原生实心路径，E 使用三横线造型，X 为红色；没有嵌入位图、滤镜、描边或阴影。上一版从产品图截取的小尺寸字样已移除，避免放大模糊和边缘杂色。已按1036 ×128 px和网站184 ×28 px两种尺寸渲染检查。

新增商品“**中国文旦柚香氛 / Wendan Pomelo Fragrance**”，归入其他品类。中文、英文各7张原图均按原字节复制到该商品 `details/images/zh` 与 `en`，编号01–07，详见该商品 `details/README.md`；本次未提供第8张。名称与卖点来自模块01、05、06：福建仙游文旦柚的香气灵感，赤柚香韵 / Crimson Pomelo X（花果香调 / Floral Fruity），青柚花语 / Jade Pomelo Bloom（柑橘花香调 / Citrus Floral），以及香水、家居香氛与洗护应用。

商品卡片封面使用内置 image_gen 编辑工具，从英文首图提取双瓶场景并去除大标题，保存到 `resources/products/catalog/wendan-pomelo-fragrance/images/pomelo-fragrance-cover.png` 和 `resources/products/featured/04-wendan-pomelo-fragrance/images/pomelo-fragrance-cover.png`。详情仍使用用户原图。

最终提示词：

> Use case: precise-object-edit. Asset type: square catalog product photograph. Edit target: the attached Chinese Wendan pomelo fragrance hero image. Extract and reframe the TWO existing glass fragrance bottles from the right side into a clean, tightly framed square product photograph for NEXMER homepage and catalog cards. Preserve their exact rounded transparent glass bottle shapes, black stepped caps, gold neck rings, liquid colors, and label designs. The left bottle label must retain the existing exact text 'Crimson Pomelo X' with 'Floral Fruity' below; the right bottle label must retain 'Jade Pomelo Bloom' with 'Citrus Floral' below. Keep both bottles complete, large and centered, standing on the same natural rock among pomelo flesh, green leaves and white citrus flowers, with the same sunny Fujian mountain-and-orchard backdrop. Remove only the large headline, descriptive copy and separator on the left; keep the two small labels unchanged. No additional logo or text, no additional bottles, no product redesign, no border. Preserve the natural bright full color, warm sunlight and existing photographic style. Square composition with enough breathing room to avoid clipping either cap or base when lightly cropped for product cards.


## 2026-10-20：四大一级分类与缩略图

分类名称和顺序取自用户上传的 `image(20261020-091604).png`：Smart Electronics、Home & Living、Fragrance & Beauty、Fashion & Culture，对应中文智能电子、家居生活、香氛美妆、时尚与文化。

台灯与文旦柚香氛缩略图分别直接复制现有商品详情提取封面至 `resources/products/categories/images/smart-electronics.png` 和 `fragrance-beauty.png`，保留相同图片字节。家居生活使用上传的 `IMG_5131.JPG`，原字节复制为 `home-living.jpg`；时尚与文化使用 `IMG_5148(1).JPG`，原字节复制为 `fashion-culture.jpg`。本次未生成、修饰或裁剪图片；汉服通过JSON的imagePosition字段按顶部对齐显示。分类图片均保留彩色。

原有“全部”入口保留为商品目录筛选，不作为首页一级分类卡片。现有三件AI产品归智能电子，收纳包归家居生活，文旦柚香氛归香氛美妆，服装归时尚与文化。


## 2026-10-20：中国盛唐汉服与彩色科技首屏

新增中国盛唐汉服 / Tang Dynasty Mural-Inspired Ramie Hanfu，中英文各 8 张原图按附件编号分别无间距排列，未修改原图。封面提取自中文详情首图，名称与苎麻、撞色团花、宽袖等卖点已分别写入首页第5件主推与目录配置。新首屏聚合现有 AI 台灯、眼镜和陪伴机器人，使用全彩黑红科技展台场景。原图映射、制作方法及完整生成提示词见 [VISUALS-2026-10-20.md](VISUALS-2026-10-20.md)。


## 2026-10-21：DT088 双槽多士炉

新增 DT088 双槽多士炉 / DT088 2-Slice Toaster，归入家居生活。上传前4张中文、后4张英文，分别存为详情01–04，无间距竖排，8张原图完整保留。首页第6件主推与目录已分别写入双槽、7档烘烤、解冻、再加热、一键停止及集屑盘等卖点。无文字商品卡片封面由内置 image_gen 从中文首图提取。文件位置与完整提示词见 [VISUALS-2026-10-21.md](VISUALS-2026-10-21.md)。


## 2026-10-21：AI 陪伴宠物

新增 AI 陪伴宠物 / AI Companion Pet，归入智能电子。上传编号1–5为中文、6–10为英文，分别存为01–05，保持每组原编号顺序无间距竖排，10张原图完整保留。首页第7件主推和目录配置均已写入双语名称、毛绒、发光蓝眼、编织挂绳及桌面、出行、送礼等卖点。无文字方形封面通过内置image_gen从中文首图提取。封面路径、方法及完整提示词见 [VISUALS-ai-companion-pet.md](VISUALS-ai-companion-pet.md)。


## 2026-10-21：AG18 AI 智能眼镜

既有ai-smart-glasses商品更新为 AI 智能眼镜 AG18 / AI Smart Glasses AG18，沿用原商品地址。中文上传编号1–5、英文6–10，分别按01–05无间距竖排，10张原图完整保留。首页第1件主推与目录均明确写入名称、第一视角拍摄、实时翻译、AI问答、智能笔记及开放式音频等简介。无文字方形封面由内置image_gen从中文首图提取，去除人物与宣传文案，保留原眼镜产品及湖山场景。路径、方法及完整提示词见 [VISUALS-ag18-glasses.md](VISUALS-ag18-glasses.md)。
