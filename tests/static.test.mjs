import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { pageOptions } from "../lib/static-routes.mjs";
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
  for (const product of content.catalog) {
    const page = pages.find(item => item.file === `dist/products/${product.id}/index.html`);
    assert.ok(page, `Missing static page for ${product.id}`);
    assert.ok(page.html.includes(product.name.zh));
    assert.ok(page.html.includes('class="detail-content detail-images"'));
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
    const template = await readFile("index.html", "utf8");
    const html = renderPage(template, configured, { mode: "home", productId: "</script>" }, renderer.render);
    assert.ok(html.includes(`<title>${escapeHTML(configured.navigation.brand)} |`));
    assert.ok(html.includes('"productId":"\\u003c/script>"'));
    assert.ok(!html.includes('<script>bad</script>'));
    assert.ok(!html.includes('__SITE_'));
  } finally { await renderer.close(); }
});
