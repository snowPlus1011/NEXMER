# AI 陪伴宠物视觉资源

2026-10-21：产品名称 AI 陪伴宠物 / AI Companion Pet，归入electronics。用户上传前5张中文、后5张英文，分别按模块1–5无间距竖排。10张原始PNG详情图均为1672 × 941 px，逐字节复制并验证SHA-256，未重绘、裁切或压缩。文件映射见 resources/products/catalog/ai-companion-pet/details/README.md。

名称与卖点来自原图的柔软毛绒、发光蓝眼、便携编织挂绳，以及桌面、床头、出行和送礼场景。两份卡片JSON均明确写入名称、简介、标签和封面。未新增原图未提供的语音、联网、供电、电池、尺寸或认证参数。

封面使用内置image_gen图像编辑工具，从中文详情第1张图提取宠物主体，去除叠加文案，保留原外形、面部、发光蓝眼、毛绒配色和挂绳并重新取景。原详情图片保持不变。

最终封面保存位置：
- resources/products/catalog/ai-companion-pet/images/ai-companion-pet-cover.png
- resources/products/featured/07-ai-companion-pet/images/ai-companion-pet-cover.png

商品文字配置：
- resources/products/catalog/ai-companion-pet/config.json
- resources/products/featured/07-ai-companion-pet/config.json

封面编辑提示词：

Use case: precise-object-edit.
Asset type: square product photograph for NEXMER homepage and catalog cards.
Edit target: the attached Chinese AI Companion Pet hero detail image.
Extract the exact plush companion on the right into a clean single 1:1 square product photograph. Preserve its round cream-colored fluffy body, dark chocolate-brown Siamese-cat face mask and two brown furry ears, two oversized luminous cyan-blue eyes with starry reflections, small black triangular nose and subtle mouth, tiny rounded feet, and the tan braided hanging cord with cream wrapped knot resting across the top. Keep all original product colors, proportions, face design and plush fiber texture.
Remove the entire left-side headline, all promotional copy, icons, decorative lines and hearts. Do not redesign the character, add limbs or alter its eyes or hanging-loop design.
Reframe the complete product centered on the same soft cream textured mat in a bright, warmly sunlit home interior with softly blurred cream furnishings and subtle greenery. The pet should occupy about 76–80% of image height, with generous margin above the rope loop, beside both ears and below the feet, so the entire product remains visible on a square listing card. Keep the cozy warm photographic style and saturated blue eye glow from the source. One product, one continuous realistic scene, crisp detailed fur and natural contact shadow.
No text, logos, watermark, labels, collage, icons, borders or additional products. Do not add specifications or features absent from the source.

