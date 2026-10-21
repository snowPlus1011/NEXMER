import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { pageOptions } from "../lib/static-routes.mjs";
import { getPageTitle, defaultCategoryImage } from "../lib/content-core.mjs";
import { loadSiteRenderer, renderPage, escapeHTML } from "../scripts/render-page.mjs";

const content = JSON.parse(await readFile("generated/content.json", "utf8"));
const files = [];
async function list(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await list(filename);
    else files.push(filename);
  }
}
await list("dist");
const htmlFiles = files.filter(file => file.endsWith(".html"));
const pages = await Promise.all(htmlFiles.map(async file => ({ file, html: await readFile(file, "utf8") })));

test("home, catalog and every enabled product have standalone HTML with rendered content", () => {
  assert.equal(htmlFiles.length, content.catalog.length + 3);
  for (const id of ['ai-companion-robot', 'everyday-apparel', 'travel-organizer']) {
    assert.ok(!htmlFiles.includes(`dist/products/${id}/index.html`), `Disabled product still has a page: ${id}`);
    for (const page of pages) assert.ok(!page.html.includes(`href="/products/${id}"`), `Disabled product is still linked: ${id}`);
  }
  for (const product of content.catalog) {
    const page = pages.find(item => item.file === `dist/products/${product.id}/index.html`);
    assert.ok(page, `Missing static page for ${product.id}`);
    assert.ok(page.html.includes(product.name.en));
    assert.ok(page.html.includes('class="detail-content detail-images'));
    const data = JSON.parse(/<script id="page-data" type="application\/json">([^<]*)<\/script>/.exec(page.html)[1]);
    assert.deepEqual(data, { mode: "detail", productId: product.id });
  }
  for (const page of pages) {
    assert.ok(!page.html.includes("__SITE_"));
    assert.ok(!page.html.includes('<div id="root"></div>'));
    assert.ok(!page.html.includes("<form"));
    assert.ok(!page.html.includes("<textarea"));
    assert.ok(!/<script[^>]+src="https?:\/\//.test(page.html));
  }
});
test("every local image, stylesheet, script and page link resolves to a shipped static file", async () => {
  const references = new Set();
  for (const { html } of pages) for (const match of html.matchAll(/\b(?:src|href)="([^"&]+)(?:&[^"]*)?"/g)) {
    const value = match[1];
    if (!value.startsWith("/")) continue;
    const pathname = decodeURIComponent(new URL(value, "http://localhost/").pathname);
    references.add(pathname);
  }
  for (const pathname of references) {
    const filename = path.join("dist", pathname);
    try { await access(filename); }
    catch { assert.fail(`Missing local resource or page: ${pathname}`); }
    if (!path.extname(filename)) await access(path.join(filename, "index.html"));
  }
});
test("all six default photos are included as nonempty WebP images in the static package", async () => {
  for (const name of ["hero", "glasses", "robot", "lamp", "clothing", "travel"]) {
    const filename = `dist/defaults/${name}.webp`;
    const data = await readFile(filename);
    assert.ok(data.length > 1024, `${filename} must contain a real photo`);
    assert.equal(data.toString("ascii", 0, 4), "RIFF");
    assert.equal(data.toString("ascii", 8, 12), "WEBP");
  }
});

test("all four configured category photos and their matching fallback photos are shipped", async () => {
  const categories = content.categories.items.filter(item => item.id !== 'all');
  assert.equal(categories.length, 4);
  for (const category of categories) {
    assert.deepEqual(await readFile(path.join('dist', category.image)), await readFile(category.image.slice(1)));
    const fallback = await readFile(path.join('dist', defaultCategoryImage(category.id)));
    assert.ok(fallback.length > 1024);
  }
});

test("the shipped NEXMER wordmark uses filled vector paths without raster images, filters or outlines", async () => {
  const svg = await readFile(path.join('dist', content.navigation.logo), 'utf8');
  assert.ok(svg.includes('<path'));
  assert.ok(svg.includes('fill="#c62828"'));
  assert.ok(!/<image|<filter|\bstroke(?:=|:)|data:image|<text\b/i.test(svg));
  assert.ok(svg.includes('viewBox="0 0 518 64"'));
});

test("all seven fragrance image pairs and both configured covers ship in the static package", async () => {
  const product = content.catalog.find(item => item.id === 'wendan-pomelo-fragrance');
  const featured = content.featured.find(item => item.id === product.id);
  for (const block of product.details) for (const language of ['en', 'zh']) {
    assert.deepEqual(await readFile(path.join('dist', block.image[language])), await readFile(block.image[language].slice(1)));
  }
  for (const item of [product, featured]) await access(path.join('dist', item.image));
});
test("Hanfu's sixteen original images, both covers and the new AI hero are shipped", async () => {
  const product = content.catalog.find(item => item.id === 'tang-dynasty-ramie-hanfu');
  const featured = content.featured.find(item => item.id === product.id);
  assert.equal(product.details.length, 8);
  for (const block of product.details) for (const language of ['en', 'zh']) {
    assert.deepEqual(await readFile(path.join('dist', block.image[language])), await readFile(block.image[language].slice(1)));
  }
  assert.deepEqual(await readFile(path.join('dist', product.image)), await readFile(path.join('dist', featured.image)));
  assert.ok(content.about.image.endsWith('/images/hero-ai-collection.png'));
  assert.deepEqual(await readFile(path.join('dist', content.about.image)), await readFile(content.about.image.slice(1)));
  const home = pages.find(page => page.file === 'dist/index.html').html;
  assert.ok(home.includes(`src="${content.about.image}"`));
  assert.ok(home.indexOf('aria-labelledby="categories-title"') < home.indexOf('aria-labelledby="products-title"'));
});
for (const [id, quantity] of [['dt088-toaster', 4], ['ai-companion-pet', 5], ['ai-smart-glasses', 5]]) test(`${id} ships all bilingual original pairs and identical homepage/catalog covers`, async () => {
  const product = content.catalog.find(item => item.id === id);
  const featured = content.featured.find(item => item.id === product.id);
  assert.equal(product.details.length, quantity);
  for (const block of product.details) for (const language of ['en', 'zh']) {
    assert.deepEqual(await readFile(path.join('dist', block.image[language])), await readFile(block.image[language].slice(1)));
  }
  assert.deepEqual(await readFile(path.join('dist', product.image)), await readFile(path.join('dist', featured.image)));
  const detail = pages.find(page => page.file === `dist/products/${id}/index.html`);
  assert.ok(detail.html.includes(product.name.en));
  assert.ok(detail.html.includes(`details/images/en/${String(quantity).padStart(2, '0')}.png`));
});
test("static output contains no server entrypoint, mail API or cloud runtime", async () => {
  assert.ok(!files.some(file => /(?:_worker|wrangler|cloudflare|\/server\/|\/api\/)/i.test(file)));
  for (const file of files.filter(file => /\.(?:js|html|json)$/.test(file))) {
    const source = await readFile(file, "utf8");
    assert.ok(!/api\/inquiry|api\.resend\.com|RESEND_API_KEY|cloudflare:workers/.test(source), file);
  }
});
test("routes work with trailing slashes, explicit index.html and static detail paths", () => {
  for (const url of ["/", "/index.html"]) assert.equal(pageOptions(url).mode, "home");
  for (const url of ["/products", "/products/", "/products/index.html"]) assert.equal(pageOptions(url).mode, "catalog");
  for (const url of ["/products/ai-smart-glasses", "/products/ai-smart-glasses/", "/products/ai-smart-glasses/index.html"]) {
    assert.deepEqual(pageOptions(url), { mode: "detail", productId: "ai-smart-glasses" });
  }
});
test("static metadata and bootstrap data preserve literal text without HTML injection", async () => {
  const renderer = await loadSiteRenderer();
  try {
    const configured = structuredClone(content);
    configured.navigation.brand = 'A $& </title><script>bad</script>';
    configured.navigation.siteTitle = configured.navigation.brand;
    const template = await readFile("index.html", "utf8");
    const html = renderPage(template, configured, { mode: "home", productId: "</script>" }, renderer.render);
    assert.ok(html.includes(`<title>${escapeHTML(configured.navigation.siteTitle)}</title>`));
    assert.ok(html.includes('"productId":"\\u003c/script>"'));
    assert.ok(!html.includes('<script>bad</script>'));
    assert.ok(!html.includes('__SITE_'));
  } finally { await renderer.close(); }
});

test("first HTML is English with the exact configured homepage title; both image languages ship", async () => {
  const home = pages.find(page => page.file === 'dist/index.html').html;
  assert.ok(home.includes('<html lang="en">'));
  assert.ok(home.includes('<title>NEXMER｜AI Products from China</title>'));
  assert.ok(home.includes('About us'));
  assert.ok(home.includes('aria-label="切换为中文"'));
  assert.equal(getPageTitle(content, 'home', undefined, 'en'), 'NEXMER｜AI Products from China');
  assert.equal(getPageTitle(content, 'home', undefined, 'zh'), 'NEXMER｜AI Products from China');
  const product = content.catalog.find(item => item.id === 'ai-smart-lamp');
  assert.equal(product.details.length, 8);
  for (const block of product.details) for (const language of ['en', 'zh']) {
    const published = await readFile(path.join('dist', block.image[language]));
    const original = await readFile(block.image[language].slice(1));
    assert.deepEqual(published, original);
  }
});
