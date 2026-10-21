export const fallbackImage = "/defaults/hero.webp";
export const defaults = {
  navigation: {
    brand: "NEXMER", tagline: { zh: "智能生活 · 全球甄选", en: "Considered goods. Global possibilities." },
    siteTitle: "NEXMER｜AI Products from China",
    defaultLanguage: "en", background: "", logo: "",
    links: [
      { id: "about", label: { zh: "认识我们", en: "About us" } },
      { id: "products", label: { zh: "我们的产品", en: "Our products" } },
      { id: "support", label: { zh: "服务与支持", en: "Service & support" } }
    ], contactLabel: { zh: "洽谈合作", en: "Get in touch" }
  },
  about: {
    eyebrow: { zh: "连接好产品，与新可能", en: "GOOD PRODUCTS. NEW POSSIBILITIES." },
    title: { zh: "把智能好物，\n带向更大的世界。", en: "Smarter living,\nbeyond borders." },
    sentences: [
      { zh: "我们甄选 AI 眼镜、AI 陪伴宠物、智能台灯，以及汉服、香氛与厨房电器。", en: "We bring together AI eyewear, plush companions and adaptive lighting, alongside Hanfu, fragrances and kitchen appliances." },
      { zh: "面向海外客户，从商品选择到采购沟通，让每一次合作从清晰的了解开始。", en: "For overseas buyers, we make product discovery and sourcing conversations a clear, connected experience." }
    ],
    primaryLabel: { zh: "探索我们的产品", en: "Explore the collection" },
    secondaryLabel: { zh: "联系我们", en: "Talk to us" },
    image: "/defaults/hero.webp", background: "",
    imageAlt: { zh: "AI 眼镜、陪伴机器人与智能台灯", en: "AI eyewear, a companion robot, and a desk lamp" },
    imageCaption: { zh: "为日常注入新的灵感", en: "A little more possibility, every day." },
    imageLabel: { zh: "智能生活精选", en: "THE SMART LIVING EDIT" }
  },
  products: {
    eyebrow: { zh: "精选产品 / 02", en: "THE COLLECTION / 02" },
    title: { zh: "下一件好产品，从这里发现。", en: "Meet your next great product." },
    description: { zh: "从智能科技到日常生活，探索我们的主推商品。", en: "From thoughtful technology to everyday essentials. Discover our featured selection." },
    viewAllLabel: { zh: "查看更多", en: "View all products" },
    detailsLabel: { zh: "查看详情", en: "Discover product" }, background: ""
  },
  categories: {
    eyebrow: { zh: "按品类探索 / 01", en: "EXPLORE BY CATEGORY / 01" },
    title: { zh: "好物，各有所长。", en: "Different goods. Shared possibility." }, background: "",
    items: [
      { id: "all", name: { zh: "全部", en: "All products" }, description: { zh: "完整商品目录", en: "The full collection" }, image: "/defaults/hero.webp" },
      { id: "electronics", name: { zh: "智能电子", en: "Smart Electronics" }, description: { zh: "AI 眼镜、陪伴宠物与智能照明", en: "AI eyewear, companions & smart lighting" }, image: "/defaults/lamp.webp" },
      { id: "home-living", name: { zh: "家居生活", en: "Home & Living" }, description: { zh: "小家电、厨房电器与生活好物", en: "Kitchen appliances & everyday essentials" }, image: "/defaults/toaster.jpg" },
      { id: "fragrance-beauty", name: { zh: "香氛美妆", en: "Fragrance & Beauty" }, description: { zh: "文旦柚香氛、香精与香氛生活产品", en: "Pomelo fragrance, perfume & scented living" }, image: "/defaults/pomelo-fragrance.png" },
      { id: "clothing", name: { zh: "时尚与文化", en: "Fashion & Culture" }, description: { zh: "汉服、传统服饰与文化配饰", en: "Hanfu, heritage clothing & accessories" }, image: "/defaults/hanfu.jpg" }
    ]
  },
  support: {
    eyebrow: { zh: "服务与支持 / 03", en: "LET’S CONNECT / 03" },
    title: { zh: "让下一次合作，\n从一次对话开始。", en: "Your next opportunity\nstarts with a conversation." },
    description: { zh: "告诉我们你感兴趣的商品与采购需求，我们期待与你沟通。", en: "Tell us what caught your eye and what you’re looking for. We’d love to hear from you." },
    email: "", whatsapp: "", whatsappQrImage: "",
    whatsappQrLabel: { zh: "使用 WhatsApp 扫码联系", en: "Scan with WhatsApp to connect" },
    whatsappQrAlt: { zh: "NEXMER WhatsApp 联系二维码", en: "NEXMER WhatsApp contact QR code" }, background: "",
    contactTitle: { zh: "联系信息", en: "Contact details" }
  }
};

export const defaultProducts = [
  { id: "ai-smart-glasses", category: "electronics", name: { zh: "AI 智能眼镜", en: "AI Smart Glasses" }, summary: { zh: "把智能体验融入日常佩戴，探索新一代智能眼镜。", en: "A new perspective on wearable intelligence. Discover AI eyewear for everyday life." }, tag: { zh: "智能穿戴", en: "SMART WEARABLES" }, image: "/defaults/glasses.webp", details: ["/defaults/glasses.webp"] },
  { id: "ai-companion-robot", category: "electronics", name: { zh: "AI 陪伴机器人", en: "AI Companion Robot" }, summary: { zh: "一位桌面上的新伙伴，为日常增添一点温暖与灵感。", en: "A little desk companion with a lot of personality. A warmer way to explore AI." }, tag: { zh: "智能陪伴", en: "AI COMPANIONS" }, image: "/defaults/robot.webp", details: ["/defaults/robot.webp"] },
  { id: "ai-smart-lamp", category: "electronics", name: { zh: "AI 智能台灯", en: "AI Smart Desk Lamp" }, summary: { zh: "以简洁设计点亮桌面，探索更舒适的智能照明。", en: "Considered design meets intelligent lighting. A fresh take on your desk essentials." }, tag: { zh: "智能家居", en: "SMART HOME" }, image: "/defaults/lamp.webp", details: ["/defaults/lamp.webp"] },
  { id: "everyday-apparel", category: "clothing", name: { zh: "日常服装精选", en: "Everyday Apparel" }, summary: { zh: "从简洁款式开始，发现适合日常穿着的服装。", en: "Simple silhouettes and everyday essentials. Explore our apparel selection." }, tag: { zh: "日常服装", en: "EVERYDAY APPAREL" }, image: "/defaults/clothing.webp", details: ["/defaults/clothing.webp"] },
  { id: "travel-organizer", category: "home-living", name: { zh: "旅行收纳包", en: "Travel Organizer" }, summary: { zh: "把日常小物妥善安放，为出行留一点从容。", en: "A considered place for your everyday essentials. Ready for your next journey." }, tag: { zh: "生活好物", en: "EVERYDAY GOODS" }, image: "/defaults/travel.webp", details: ["/defaults/travel.webp"] }
].map(product => ({ ...product, details: [{ type: "image", image: product.image, alt: product.name }] }));

export function defaultProductImage(product) {
  return defaultProducts.find(item => item.id === product.id)?.image ?? {
    electronics: "/defaults/glasses.webp", clothing: "/defaults/clothing.webp", other: "/defaults/travel.webp",
    "home-living": "/defaults/travel.webp", "fragrance-beauty": "/defaults/pomelo-fragrance.png"
  }[product.category] ?? fallbackImage;
}

export function defaultCategoryImage(id) {
  return defaults.categories.items.find(item => item.id === id)?.image || fallbackImage;
}

// Try a matching photo before the final emergency illustration, without looping.
export function nextImageSource(current, sources = []) {
  const choices = [...new Set([...sources, fallbackImage, "/defaults/product-placeholder.svg"].filter(Boolean))];
  const index = choices.indexOf(current);
  return index >= 0 ? choices[index + 1] : choices[0];
}

const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
export function mergeDefaults(base, override) {
  if (!isRecord(override)) return structuredClone(base);
  const result = structuredClone(base);
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null) continue;
    if (isRecord(result[key]) && "zh" in result[key] && "en" in result[key] && typeof value === "string") result[key] = value;
    else if (isRecord(result[key]) && isRecord(value)) result[key] = mergeDefaults(result[key], value);
    else if (Array.isArray(result[key]) && Array.isArray(value)) {
      result[key] = value.map((item, i) => isRecord(item) && isRecord(result[key][i]) ? mergeDefaults(result[key][i], item) : item);
    } else if (!(key in result) || typeof value === typeof result[key]) result[key] = value;
  }
  return result;
}

function imageAt(entry, value, fallback = "") {
  if (!value || typeof value !== "string") return fallback;
  if (value.startsWith("/defaults/")) return value;
  if (!entry?.files?.includes(value)) return fallback;
  return `/resources/${entry.directory}/${value.split("/").map(encodeURIComponent).join("/")}`;
}

function detailText(value) {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return "";
  return { zh: typeof value.zh === "string" ? value.zh : "", en: typeof value.en === "string" ? value.en : "" };
}
function hasDetailText(value) {
  return typeof value === "string" ? Boolean(value.trim()) : Boolean(value?.zh?.trim() || value?.en?.trim());
}
function detailImage(entry, value, fallback) {
  const resolve = file => typeof file === "string" ? imageAt(entry, `details/${file}`) : "";
  if (typeof value === "string") return resolve(value) || fallback;
  const en = resolve(value?.en), zh = resolve(value?.zh);
  return { en: en || zh || fallback, zh: zh || en || fallback };
}
export function getPageTitle(content, mode = "home", productId, language = content.navigation.defaultLanguage) {
  const text = value => typeof value === "string" ? value : value?.[language] || value?.en || value?.zh || "";
  const product = mode === "detail" ? content.catalog.find(item => item.id === productId) : null;
  if (product) return `${text(product.name)} | ${content.navigation.brand}`;
  if (mode === "catalog") return `${language === "zh" ? "商品目录" : "The collection"} | ${content.navigation.brand}`;
  return text(content.navigation.siteTitle) || `${content.navigation.brand}｜AI Products from China`;
}
async function loadDetails(entry, product, readJSON) {
  const value = entry.detailsConfig ? await readJSON(entry.detailsConfig).catch(() => ({})) : {};
  const config = isRecord(value) ? value : {};
  const blocks = Array.isArray(config.blocks) ? config.blocks.flatMap(block => {
    if (!isRecord(block)) return [];
    if (block.type === "image") return [{
      type: "image", image: detailImage(entry, block.image, product.image),
      alt: detailText(block.alt), caption: detailText(block.caption)
    }];
    if (block.type === "text") {
      const title = detailText(block.title), body = detailText(block.body);
      return hasDetailText(title) || hasDetailText(body) ? [{ type: "text", title, body }] : [];
    }
    return [];
  }) : [];
  const layout = config.layout === "seamless" ? "seamless" : "spaced";
  if (blocks.length) return { blocks, layout };
  const images = (entry.details ?? []).map(image => imageAt(entry, image)).filter(Boolean);
  return { blocks: (images.length ? images : [product.image]).map(image => ({ type: "image", image, alt: product.name })), layout };
}

// Both build-time and browser loading use the same JSON normalization.
export async function loadContent(index, readJSON) {
  const loaded = await Promise.all(Object.entries(defaults).map(async ([key, base]) => {
    const entry = index.modules?.[key];
    let value = {};
    if (entry?.config) value = await readJSON(entry.config).catch(() => ({}));
    const config = mergeDefaults(base, value);
    config.background = imageAt(entry, value.background, base.background);
    if (key === "navigation") {
      config.logo = imageAt(entry, value.logo, "");
      const links = Array.isArray(value.links) ? value.links : [];
      config.links = base.links.map(link => mergeDefaults(link, links.find(candidate => candidate?.id === link.id) ?? {}));
    }
    if (key === "support") config.whatsappQrImage = imageAt(entry, value.whatsappQrImage, "");
    if (key === "about") {
      config.image = imageAt(entry, value.image, base.image);
      config.sentences = base.sentences.map((sentence, i) => {
        const custom = Array.isArray(value.sentences) ? value.sentences[i] : undefined;
        return typeof custom === "string" ? custom : mergeDefaults(sentence, custom);
      });
    }
    if (key === "categories") {
      const configuredItems = Array.isArray(value.items) ? value.items : [];
      const items = [...base.items.map(item => mergeDefaults(item, configuredItems.find(candidate => candidate?.id === item.id) ?? {})), ...configuredItems.filter(item => item && !base.items.some(baseItem => baseItem.id === item.id))];
      const ids = new Set();
      config.items = items.filter(item => item && typeof item.id === "string" && /^[a-z][a-z0-9-]*$/.test(item.id) && !ids.has(item.id) && ids.add(item.id)).map(item => {
        const fallback = base.items.find(c => c.id === item.id) ?? { id: item.id, name: { zh: item.id, en: item.id }, description: { zh: "", en: "" }, image: fallbackImage };
        const result = mergeDefaults(fallback, item);
        result.image = imageAt(entry, item.image, fallback.image);
        return result;
      });
      // "All" stays available, even if the editor omits its definition.
      if (!config.items.some(item => item.id === "all")) config.items.unshift(structuredClone(base.items[0]));
    }
    return [key, config];
  }));
  const modules = Object.fromEntries(loaded);
  const productEntries = index.products ?? [];
  const products = (await Promise.all(productEntries.map(async entry => {
    const config = entry.config ? await readJSON(entry.config).catch(() => ({})) : {};
    if (config.enabled === false) return null;
    const base = defaultProducts.find(product => product.id === entry.id) ?? {
      id: entry.id, category: "home-living", name: { zh: entry.id, en: entry.id },
      summary: { zh: "欢迎联系我们了解更多商品信息。", en: "Contact us for more product information." },
      tag: { zh: "精选商品", en: "SELECTED GOODS" }, image: fallbackImage, details: []
    };
    const product = mergeDefaults(base, config);
    product.id = entry.id;
    if (!modules.categories.items.some(category => category.id === product.category && category.id !== "all")) product.category = modules.categories.items.find(category => category.id === "home-living")?.id || modules.categories.items.find(category => category.id !== "all")?.id || "home-living";
    const defaultImage = defaultProductImage(product);
    product.image = imageAt(entry, config.image, entry.covers?.length ? imageAt(entry, entry.covers[0], defaultImage) : defaultImage);
    const details = await loadDetails(entry, product, readJSON);
    product.details = details.blocks;
    product.detailsLayout = details.layout;
    return product;
  }))).filter(Boolean);
  const allProducts = productEntries.length ? products : structuredClone(defaultProducts);
  const featuredEntries = index.featured ?? [];
  const featured = (await Promise.all(featuredEntries.map(async entry => {
    const config = entry.config ? await readJSON(entry.config).catch(() => ({})) : {};
    if (config.enabled === false) return null;
    const original = allProducts.find(product => product.id === config.productId);
    if (!original) return null;
    const product = mergeDefaults(original, config);
    product.id = original.id;
    product.category = original.category;
    product.details = original.details;
    product.image = imageAt(entry, config.image, original.image);
    return product;
  }))).filter(Boolean);
  return { ...modules, catalog: allProducts, featured: featuredEntries.length ? featured : allProducts.slice(0, 3) };
}

export async function fetchContent(fetcher = fetch) {
  const readJSON = async url => {
    const response = await fetcher(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Cannot load ${url}`);
    return response.json();
  };
  const index = await readJSON("/resources/index.json");
  return loadContent(index, readJSON);
}
