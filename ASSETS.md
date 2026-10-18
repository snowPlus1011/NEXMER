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
