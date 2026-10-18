"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Globe2, Mail, Menu, MessageCircle, Search, X } from "lucide-react";
import { fetchContent, fallbackImage, defaultProductImage, nextImageSource } from "@/lib/content-core.mjs";
import { localize, type ContentData, type Language, type Localized, type Product } from "@/lib/content-types";

type Mode = "home" | "catalog" | "detail";
const ui = {
  zh: { collection: "商品目录", back: "返回首页", results: "件商品", search: "搜索商品名称或描述", sort: "排序", featured: "默认顺序", az: "名称 A—Z", za: "名称 Z—A", empty: "暂时没有匹配的商品。", reset: "查看全部商品", email: "邮件联系", whatsapp: "WhatsApp 联系", contactPending: "联系方式待补充", contact: "联系我们", detail: "商品详情", sample: "展示样稿 · 商品图为示意图", detailCount: "段图文内容", noProduct: "商品暂未上架", clear: "清空搜索", nav: "网站导航", category: "商品分类", language: "Switch to English", footer: "好产品，让世界更近一点。" },
  en: { collection: "The collection", back: "Back to home", results: "products", search: "Search products", sort: "Sort", featured: "Default order", az: "Name A–Z", za: "Name Z–A", empty: "No products match your search.", reset: "Explore all products", email: "Email us", whatsapp: "Chat on WhatsApp", contactPending: "Contact details coming soon", contact: "Contact us", detail: "Product details", sample: "Sample product · Illustrative images", detailCount: "detail sections", noProduct: "Product unavailable", clear: "Clear search", nav: "Site navigation", category: "Product categories", language: "切换为中文", footer: "Good products. A world of possibilities." }
};
function background(image: string) { return image ? { backgroundImage: `url("${image.replace(/["\\\n\r]/g, "")}")` } : undefined; }
function SmartImage({ src, alt, className = "", eager = false, fallback = [] }: { src: string; alt: string; className?: string; eager?: boolean; fallback?: string[] }) {
  const initialSource = src || fallback[0] || fallbackImage;
  return <img className={className} src={initialSource} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={event => {
    const next = nextImageSource(event.currentTarget.getAttribute("src"), [initialSource, ...fallback]);
    if (next) event.currentTarget.src = next;
  }} />;
}
function Brand({ content }: { content: ContentData }) {
  const name = content.navigation.brand;
  return <a href="/" className="brand" aria-label={name}>{content.navigation.logo
    ? <SmartImage src={content.navigation.logo} alt={name} className="brand-image" eager />
    : <span className="brand-fallback">{name.toUpperCase() === "NEXMER" ? <>NE<span className="brand-fallback-x">X</span>MER</> : name}</span>}
  </a>;
}
function ProductCard({ product, language, content }: { product: Product; language: Language; content: ContentData }) {
  const t = (value: Localized) => localize(value, language);
  return <a className="product-card" href={`/products/${encodeURIComponent(product.id)}`} aria-label={`${t(product.name)} — ${t(content.products.detailsLabel)}`}>
    <div className="product-image-wrap"><SmartImage src={product.image} fallback={[defaultProductImage(product)]} alt={t(product.name)} /><span className="product-image-arrow" aria-hidden="true"><ArrowUpRight size={21} /></span></div>
    <div className="product-info"><div className="product-tag">{t(product.tag)}</div><h3>{t(product.name)}</h3><p>{t(product.summary)}</p><span className="text-link">{t(content.products.detailsLabel)} <ArrowRight size={16} aria-hidden="true" /></span></div>
  </a>;
}
function ProductDetails({ product, language }: { product: Product; language: Language }) {
  const t = (value: Localized | undefined) => localize(value, language);
  const imageCount = product.details.filter(block => block.type === "image").length;
  let imageNumber = 0;
  return <div className="detail-content detail-images">{product.details.map((block, index) => {
    if (block.type === "text") {
      const title = t(block.title), body = t(block.body);
      return <div className="detail-text-block" key={`text-${index}`}>
        {title && <h2>{title}</h2>}
        {body && <div className="detail-text-body">{body.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>}
      </div>;
    }
    const number = ++imageNumber;
    const caption = t(block.caption);
    return <figure className="detail-image-block" key={`image-${index}`}>
      <a className="detail-image-button" href={block.image} target="_blank" rel="noopener noreferrer" aria-label={`${t(product.name)} ${number} — ${language === "zh" ? "查看原图（新窗口）" : "View original image (new window)"}`}>
        <SmartImage src={block.image} fallback={[product.image, defaultProductImage(product)]} alt={t(block.alt) || `${t(product.name)} — ${ui[language].detail} ${number}`} eager={number === 1} />
        <span>{String(number).padStart(2, "0")} / {String(imageCount).padStart(2, "0")}<ArrowUpRight size={17} /></span>
      </a>
      {caption && <figcaption className="detail-caption">{caption}</figcaption>}
    </figure>;
  })}</div>;
}
export default function Site({ initialContent, mode, initialCategory = "all", productId }: { initialContent: ContentData; mode: Mode; initialCategory?: string; productId?: string }) {
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState<Language>(initialContent.navigation.defaultLanguage === "en" ? "en" : "zh");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(mode === "home" ? "about" : "products");
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const text = ui[language];
  const t = (value: Localized | undefined) => localize(value, language);
  const selectedProduct = content.catalog.find(product => product.id === productId);
  const menuButton = useRef<HTMLButtonElement>(null);
  const anySamples = content.catalog.some(product => product.sample);
  useEffect(() => {
    let active = true;
    if (mode === "catalog") setCategory(new URLSearchParams(window.location.search).get("category") || "all");
    fetchContent().then(data => { if (active) setContent(data as ContentData); }).catch(() => {});
    try { const saved = localStorage.getItem("nexmer-language"); if (saved === "en" || saved === "zh") setLanguage(saved); } catch {}
    return () => { active = false; };
  }, []);
  useEffect(() => { document.documentElement.lang = language === "zh" ? "zh-CN" : "en"; }, [language]);
  useEffect(() => {
    document.title = `${selectedProduct ? t(selectedProduct.name) : mode === "catalog" ? text.collection : t(content.navigation.tagline)} | ${content.navigation.brand}`;
  }, [content, language, mode, selectedProduct]);
  useEffect(() => {
    if (mode !== "home") return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { rootMargin: "-20% 0px -60% 0px" });
    ["about", "products", "support"].forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [mode]);
  useEffect(() => {
    const pop = () => setCategory(new URLSearchParams(window.location.search).get("category") || "all");
    const key = (event: KeyboardEvent) => { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener("popstate", pop); window.addEventListener("keydown", key);
    return () => { window.removeEventListener("popstate", pop); window.removeEventListener("keydown", key); };
  }, [menuOpen]);
  const validCategory = content.categories.items.some(item => item.id === category) ? category : "all";
  const visibleProducts = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(language === "zh" ? "zh-CN" : "en");
    const products = content.catalog.filter(product => (validCategory === "all" || product.category === validCategory) && (!q || `${t(product.name)} ${t(product.summary)} ${t(product.tag)}`.toLocaleLowerCase(language === "zh" ? "zh-CN" : "en").includes(q)));
    if (sort !== "default") products.sort((a, b) => t(a.name).localeCompare(t(b.name), language === "zh" ? "zh-CN" : "en", { numeric: true }) * (sort === "za" ? -1 : 1));
    return products;
  }, [content, validCategory, query, sort, language]);
  const changeCategory = (id: string) => { setCategory(id); const url = new URL(window.location.href); url.searchParams.set("category", id); window.history.pushState({}, "", url); };
  const toggleLanguage = () => { const next = language === "zh" ? "en" : "zh"; setLanguage(next); try { localStorage.setItem("nexmer-language", next); } catch {} };
  const productCount = (id: string) => id === "all" ? content.catalog.length : content.catalog.filter(product => product.category === id).length;
  const navTarget = (id: string) => mode === "home" ? `#${id}` : `/#${id}`;
  return <div className={`site language-${language}`}>
    <a href="#main-content" className="skip-link">{language === "zh" ? "跳到正文" : "Skip to content"}</a>
    <header className="site-header" style={background(content.navigation.background)}>
      <div className="nav-shell"><Brand content={content} /><nav className="desktop-nav" aria-label={text.nav}>{content.navigation.links.map(link => <a key={link.id} href={navTarget(link.id)} className={activeSection === link.id ? "active" : ""} aria-current={activeSection === link.id ? "location" : undefined}>{t(link.label)}</a>)}</nav><div className="nav-actions"><button className="language-toggle" aria-label={text.language} onClick={toggleLanguage}><Globe2 size={15} />{language === "zh" ? "EN" : "中文"}</button><a className="nav-contact" href={navTarget("support")}>{t(content.navigation.contactLabel)}<ArrowUpRight size={16} /></a><button ref={menuButton} className="menu-toggle" aria-label={text.nav} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button></div></div>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label={text.nav}>{content.navigation.links.map(link => <a key={link.id} href={navTarget(link.id)} onClick={() => setMenuOpen(false)}>{t(link.label)}<ArrowUpRight size={18} /></a>)}</nav>}
    </header>
    <main id="main-content">
      {mode === "home" && <>
        <section id="about" className="hero section-background" style={background(content.about.background)} aria-labelledby="hero-title">
          <div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="status-dot" />{t(content.about.eyebrow)}</div><h1 id="hero-title">{t(content.about.title).split("\n").map((line, i) => <span key={i} className={i === 1 ? "headline-accent" : ""}>{line}</span>)}</h1><div className="hero-description">{content.about.sentences.slice(0, 2).map((sentence, i) => <p key={i}>{t(sentence)}</p>)}</div><div className="hero-actions"><a className="button primary" href="#products">{t(content.about.primaryLabel)}<ArrowUpRight size={18} /></a><a className="text-link hero-secondary" href="#support">{t(content.about.secondaryLabel)}<ArrowRight size={17} /></a></div><div className="hero-footnote"><span className="thin-rule" />{t(content.navigation.tagline)}</div></div><div className="hero-visual"><SmartImage src={content.about.image} alt={t(content.about.imageAlt)} eager /><div className="image-caption"><div><span>{t(content.about.imageLabel)}</span><p>{t(content.about.imageCaption)}</p></div><a href="#products" aria-label={t(content.about.primaryLabel)}><ArrowDown size={24} /></a></div><span className="hero-image-index">01 — COLLECTION</span></div></div>
        </section>
        <section id="products" className="featured-section section-background" style={background(content.products.background)} aria-labelledby="products-title"><div className="container"><div className="section-heading"><div><div className="eyebrow">{t(content.products.eyebrow)}</div><h2 id="products-title">{t(content.products.title)}</h2><p className="section-description">{t(content.products.description)}</p></div><a className="outline-link" href="/products?category=all">{t(content.products.viewAllLabel)}<ArrowUpRight size={18} /></a></div><div className="product-grid featured-grid">{content.featured.map((product, i) => <ProductCard key={`${product.id}-${i}`} product={product} language={language} content={content} />)}</div>{!content.featured.length && <p className="empty-state">{text.noProduct}</p>}</div></section>
        <section className="categories-section section-background" style={background(content.categories.background)} aria-labelledby="categories-title"><div className="container"><div className="section-heading compact"><div><div className="eyebrow">{t(content.categories.eyebrow)}</div><h2 id="categories-title">{t(content.categories.title)}</h2></div><span className="section-side-note">{content.catalog.length.toString().padStart(2, "0")} / {text.results}</span></div><div className="category-grid">{content.categories.items.map((item, i) => <a key={item.id} className={`category-card category-${item.id}`} href={`/products?category=${encodeURIComponent(item.id)}`}><SmartImage src={item.image} fallback={[item.id === "all" ? fallbackImage : defaultProductImage({ category: item.id })]} alt="" /><div className="category-top"><span>{String(i + 1).padStart(2, "0")}</span><ArrowUpRight size={21} /></div><div className="category-copy"><h3>{t(item.name)}</h3><p>{t(item.description)}</p><span className="category-count">{productCount(item.id)} {text.results}</span></div></a>)}</div></div></section>
        <Support content={content} language={language} />
      </>}
      {mode === "catalog" && <section className="catalog-page container"><a href="/" className="text-link breadcrumb"><ArrowLeft size={16} />{text.back}</a><div className="catalog-title"><div><div className="eyebrow">{t(content.products.eyebrow)}</div><h1>{text.collection}<span className="headline-dot">.</span></h1><p>{t(content.products.description)}</p></div><span className="catalog-total">{content.catalog.length.toString().padStart(2, "0")}<span>{text.results}</span></span></div><div className="catalog-tools"><div role="tablist" className="category-tabs" aria-label={text.category}>{content.categories.items.map(item => <button role="tab" id={`tab-${item.id}`} aria-controls="catalog-panel" aria-selected={validCategory === item.id} tabIndex={validCategory === item.id ? 0 : -1} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); const items = content.categories.items; const next = (items.findIndex(category => category.id === item.id) + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length; changeCategory(items[next].id); document.getElementById(`tab-${items[next].id}`)?.focus(); } }} key={item.id} className={validCategory === item.id ? "selected" : ""} onClick={() => changeCategory(item.id)}>{t(item.name)}<span>{productCount(item.id)}</span></button>)}</div><div className="search-box"><Search size={18} aria-hidden="true" /><input aria-label={text.search} placeholder={text.search} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label={text.clear} onClick={() => setQuery("")}><X size={16} /></button>}</div></div><div className="catalog-meta"><span aria-live="polite">{visibleProducts.length} {text.results}</span><label className="sort-control"><span>{text.sort}</span><select aria-label={text.sort} value={sort} onChange={event => setSort(event.target.value)}><option value="default">{text.featured}</option><option value="az">{text.az}</option><option value="za">{text.za}</option></select><ChevronDown size={14} /></label></div><div id="catalog-panel" role="tabpanel" aria-labelledby={`tab-${validCategory}`}><div className="product-grid catalog-grid">{visibleProducts.map(product => <ProductCard key={product.id} product={product} language={language} content={content} />)}</div>{!visibleProducts.length && <div className="empty-state"><Search size={30} /><h2>{text.empty}</h2><button className="button primary" onClick={() => { setQuery(""); changeCategory("all"); }}>{text.reset}<ArrowRight size={16} /></button></div>}</div></section>}
      {mode === "detail" && (selectedProduct ? <section className="detail-page container"><a className="text-link breadcrumb" href={`/products?category=${encodeURIComponent(selectedProduct.category)}`}><ArrowLeft size={16} />{text.collection} / {t(content.categories.items.find(item => item.id === selectedProduct.category)?.name)}</a><div className="detail-heading"><div><div className="eyebrow">{t(selectedProduct.tag)}</div><h1>{t(selectedProduct.name)}</h1><p>{t(selectedProduct.summary)}</p>{selectedProduct.sample && <span className="sample-badge">{text.sample}</span>}</div><a className="button primary" href="/#support">{text.contact}<ArrowUpRight size={18} /></a></div><div className="detail-image-heading"><span>{text.detail}</span><span>{selectedProduct.details.length.toString().padStart(2, "0")} {text.detailCount}<ArrowDown size={16} /></span></div><ProductDetails product={selectedProduct} language={language} /><div className="detail-bottom"><div><div className="eyebrow">{t(content.support.eyebrow)}</div><h2>{language === "zh" ? "感兴趣？聊聊你的需求。" : "Caught your eye? Let’s talk."}</h2></div><a className="button primary" href="/#support">{text.contact}<ArrowRight size={17} /></a></div></section> : <div className="empty-state">{text.noProduct}<a href="/products">{text.collection}</a></div>)}
    </main>
    <footer className="site-footer"><div className="container footer-top"><div><Brand content={content} /><p>{text.footer}</p></div><nav aria-label={text.nav}>{content.navigation.links.map(link => <a key={link.id} href={navTarget(link.id)}>{t(link.label)}</a>)}</nav><a href="#main-content" className="back-top" aria-label={language === "zh" ? "回到顶部" : "Back to top"}><ArrowUpRight size={23} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {content.navigation.brand}</span>{anySamples && <span className="footer-demo">{t(content.navigation.sampleNotice)}</span>}<span className="footer-lang">{language === "zh" ? "为全球采购而精选" : "Selected for global sourcing"}<Globe2 size={13} /></span></div></footer>
  </div>;
}
function Support({ content, language }: { content: ContentData; language: Language }) {
  const { support } = content;
  const t = (value: Localized) => localize(value, language);
  const text = ui[language];
  const digits = support.whatsapp.replace(/[^0-9]/g, "");
  const emailReady = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(support.email);
  const phoneReady = digits.length >= 7 && digits.length <= 15;
  return <section id="support" className="support-section section-background" style={background(support.background)} aria-labelledby="support-title">
    <div className="container support-grid">
      <div className="support-copy">
        <div className="eyebrow">{t(support.eyebrow)}</div><h2 id="support-title">{t(support.title)}</h2><p className="support-description">{t(support.description)}</p>
        <div className="support-decoration" aria-hidden="true"><span>↗</span><p>GOOD GOODS.<br />GREAT POSSIBILITIES.</p></div>
      </div>
      <div className="support-contact-panel">
        <h3>{t(support.contactTitle)}</h3>
        <div className="contact-list">
          {emailReady ? <a href={`mailto:${support.email}`} className="contact-row"><span className="contact-icon"><Mail size={21} /></span><span><small>{text.email}</small><strong>{support.email}</strong></span><ArrowUpRight size={18} /></a> : <div className="contact-row contact-pending"><span className="contact-icon"><Mail size={21} /></span><span><small>Email</small><strong>{text.contactPending}</strong></span></div>}
          {phoneReady ? <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="contact-row"><span className="contact-icon"><MessageCircle size={22} /></span><span><small>{text.whatsapp}</small><strong>{support.whatsapp}</strong></span><ArrowUpRight size={18} /></a> : <div className="contact-row contact-pending"><span className="contact-icon"><MessageCircle size={22} /></span><span><small>WhatsApp</small><strong>{text.contactPending}</strong></span></div>}
        </div>
      </div>
    </div>
  </section>;
}
