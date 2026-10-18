import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { syncContent } from "../scripts/sync-content.mjs";
import { loadContent, defaultProductImage, nextImageSource } from "../lib/content-core.mjs";
async function fixture(t) { const root = await mkdtemp(path.join(tmpdir(), "trade-content-")); t.after(() => rm(root, { recursive: true, force: true })); return root; }
async function config(root, directory, value) { const folder = path.join(root, "resources", directory); await mkdir(folder, { recursive: true }); await writeFile(path.join(folder, "config.json"), JSON.stringify(value)); return folder; }
async function image(folder, name) { const file = path.join(folder, name); await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, "image fixture"); }

test("missing modules and partial bilingual fields retain usable defaults", async t => {
  const root = await fixture(t);
  await config(root, "navigation", { brand: "Test Trade", links: [{ id: "products", label: { zh: "商品中心" } }] });
  await config(root, "about", { title: "我的展示站", sentences: [{ zh: "第一句话" }] });
  const { snapshot } = await syncContent(root, true);
  assert.equal(snapshot.navigation.brand, "Test Trade");
  assert.equal(snapshot.navigation.links[0].label.zh, "认识我们");
  assert.equal(snapshot.navigation.links[1].label.zh, "商品中心");
  assert.equal(snapshot.navigation.links[1].label.en, "Our products");
  assert.equal(snapshot.about.title, "我的展示站");
  assert.equal(snapshot.about.sentences.length, 2);
  assert.equal(snapshot.catalog.length, 5);
  assert.equal(snapshot.featured.length, 3);
});
test("folder additions control featured counts; detail images use numeric file order", async t => {
  const root = await fixture(t);
  for (let i = 1; i <= 4; i++) {
    const folder = await config(root, `products/catalog/product-${i}`, { name: { zh: `商品${i}`, en: `Product ${i}` }, category: "electronics", image: "images/cover.webp" });
    await image(folder, "images/cover.webp");
    for (const name of ["10.webp", "2.webp", "01.webp"]) await image(folder, `images/details/${name}`);
    await writeFile(path.join(folder, "images/details/图片要求.md"), "Not an image");
    await config(root, `products/featured/0${i}-product`, { productId: `product-${i}` });
  }
  const { index, snapshot } = await syncContent(root, true);
  assert.equal(snapshot.catalog.length, 4); assert.equal(snapshot.featured.length, 4);
  assert.deepEqual(snapshot.catalog[0].details.map(block => block.image.split("/").at(-1)), ["01.webp", "2.webp", "10.webp"]);
  const browserResult = await loadContent(index, async url => JSON.parse(await readFile(path.join(root, "public", url), "utf8")));
  assert.deepEqual(browserResult, snapshot);
});
test("disabled products and featured folders do not silently resurrect defaults", async t => {
  const root = await fixture(t);
  await config(root, "products/catalog/hidden-product", { enabled: false });
  await config(root, "products/featured/01-hidden", { enabled: false, productId: "hidden-product" });
  const { snapshot } = await syncContent(root, true);
  assert.equal(snapshot.catalog.length, 0); assert.equal(snapshot.featured.length, 0);
});
test("category overrides match IDs and preserve unspecified categories", async t => {
  const root = await fixture(t);
  await config(root, "products/categories", { items: [{ id: "electronics", name: { zh: "智能电子" } }, { id: "accessories", name: "配件" }] });
  const { snapshot } = await syncContent(root, true);
  assert.deepEqual(snapshot.categories.items.map(item => item.id), ["all", "electronics", "clothing", "other", "accessories"]);
  assert.equal(snapshot.categories.items[1].name.zh, "智能电子");
  assert.equal(snapshot.categories.items[1].name.en, "Electronics");
  assert.equal(snapshot.categories.items[4].name, "配件");
});
test("missing cover/detail images use a real fallback path", async t => {
  const root = await fixture(t);
  await config(root, "products/catalog/new-product", { image: "images/missing.webp" });
  const { snapshot, warnings } = await syncContent(root, true);
  assert.equal(snapshot.catalog[0].image, "/defaults/travel.webp");
  assert.equal(snapshot.catalog[0].details.length, 1);
  assert.equal(snapshot.catalog[0].details[0].type, "image");
  assert.equal(snapshot.catalog[0].details[0].image, "/defaults/travel.webp");
  assert.equal(warnings.length, 1);
});
test("products without configured photos receive matching colorful sample photos", async t => {
  const root = await fixture(t);
  for (const [id, category] of [["ai-companion-robot", "electronics"], ["ai-smart-lamp", "electronics"], ["new-electronics", "electronics"], ["new-apparel", "clothing"], ["new-goods", "other"]]) {
    await config(root, `products/catalog/${id}`, { category });
  }
  const { snapshot } = await syncContent(root, true);
  const expected = { "ai-companion-robot": "/defaults/robot.webp", "ai-smart-lamp": "/defaults/lamp.webp", "new-electronics": "/defaults/glasses.webp", "new-apparel": "/defaults/clothing.webp", "new-goods": "/defaults/travel.webp" };
  for (const product of snapshot.catalog) {
    assert.equal(product.image, expected[product.id]);
    assert.equal(product.details[0].image, expected[product.id]);
  }
});
test("failed detail images try cover and matching photo before the generic image, then stop", () => {
  const photo = defaultProductImage({ id: "everyday-apparel", category: "clothing" });
  const sources = ["/resources/broken-detail.webp", "/resources/broken-cover.webp", photo];
  let current = sources[0];
  const reached = [];
  while (current) {
    assert.ok(!reached.includes(current), "fallback must not loop");
    reached.push(current);
    current = nextImageSource(current, sources);
  }
  assert.deepEqual(reached, [...sources, "/defaults/hero.webp", "/defaults/product-placeholder.svg"]);
});
test("malformed JSON and dangling featured links stop publication with a concrete filename", async t => {
  const root = await fixture(t);
  const folder = await config(root, "about", {});
  await writeFile(path.join(folder, "config.json"), '{"title":');
  await assert.rejects(() => syncContent(root, true), /resources\/about\/config.json/);
  await writeFile(path.join(folder, "config.json"), "{}");
  await config(root, "products/featured/01-broken", { productId: "missing-product" });
  await assert.rejects(() => syncContent(root, true), /productId/);
});
test("image paths cannot read outside their module folders", async t => {
  const root = await fixture(t);
  await config(root, "about", { image: "../../private.webp" });
  await assert.rejects(() => syncContent(root, true), /相对图片路径/);
});
test("detail JSON controls mixed block order, relative image paths and unreferenced images", async t => {
  const root = await fixture(t);
  const product = await config(root, "products/catalog/mixed-product", { name: "图文商品" });
  for (const name of ["01.webp", "02.webp", "03.webp"]) await image(product, `details/images/${name}`);
  await config(root, "products/catalog/mixed-product/details", { blocks: [
    { type: "text", title: { zh: "第一段" }, body: "正文一\n\n正文二" },
    { type: "image", image: "images/02.webp", caption: { en: "Second image first" } },
    { type: "text", body: { en: "Another paragraph" } },
    { type: "image", image: "images/01.webp", alt: "自定义图片说明" }
  ] });
  const { index, snapshot } = await syncContent(root, true);
  const blocks = snapshot.catalog[0].details;
  assert.deepEqual(blocks.map(block => block.type), ["text", "image", "text", "image"]);
  assert.deepEqual(blocks[0].title, { zh: "第一段", en: "" });
  assert.equal(blocks[0].body, "正文一\n\n正文二");
  assert.equal(blocks[1].image, "/resources/products/catalog/mixed-product/details/images/02.webp");
  assert.equal(blocks[3].image, "/resources/products/catalog/mixed-product/details/images/01.webp");
  assert.equal(blocks[3].alt, "自定义图片说明");
  const browserResult = await loadContent(index, async url => JSON.parse(await readFile(path.join(root, "public", url), "utf8")));
  assert.deepEqual(browserResult, snapshot);
});
test("text-only details stay text-only; missing or empty JSON uses natural image order", async t => {
  const root = await fixture(t);
  const product = await config(root, "products/catalog/text-product", {});
  for (const name of ["10.webp", "2.webp"]) await image(product, `details/images/${name}`);
  const details = await config(root, "products/catalog/text-product/details", { blocks: [{ type: "text", body: "只有文字" }] });
  let result = await syncContent(root, true);
  assert.deepEqual(result.snapshot.catalog[0].details, [{ type: "text", title: "", body: "只有文字" }]);
  await config(root, "products/catalog/text-product/details", { blocks: [] });
  result = await syncContent(root, true);
  assert.deepEqual(result.snapshot.catalog[0].details.map(block => block.image.split("/").at(-1)), ["2.webp", "10.webp"]);
  await rm(path.join(details, "config.json"));
  const missing = await syncContent(root, true);
  assert.deepEqual(missing.snapshot.catalog[0].details, result.snapshot.catalog[0].details);
});
test("missing configured detail images preserve text and captions while using the cover", async t => {
  const root = await fixture(t);
  const product = await config(root, "products/catalog/missing-detail", { image: "images/cover.webp" });
  await image(product, "images/cover.webp");
  await config(root, "products/catalog/missing-detail/details", { blocks: [
    { type: "image", image: "images/missing.webp", caption: "保留图注" },
    { type: "text", body: "保留文字" }
  ] });
  const { snapshot, warnings } = await syncContent(root, true);
  assert.equal(snapshot.catalog[0].details[0].image, snapshot.catalog[0].image);
  assert.equal(snapshot.catalog[0].details[0].caption, "保留图注");
  assert.equal(snapshot.catalog[0].details[1].body, "保留文字");
  assert.match(warnings[0], /details\/config.json.*blocks\[0\]/);
});
test("invalid detail JSON, block types, text and paths identify the detail filename", async t => {
  const root = await fixture(t);
  const directory = "products/catalog/broken-product/details";
  const details = await config(root, directory, {});
  await writeFile(path.join(details, "config.json"), '{"blocks":');
  await assert.rejects(() => syncContent(root, true), /broken-product\/details\/config.json/);
  for (const value of [
    { blocks: "wrong" },
    { blocks: [{ type: "video" }] },
    { blocks: [{ type: "text", body: ["wrong"] }] },
    { blocks: [{ type: "image", image: "../images/private.webp" }] },
    { blocks: [{ type: "image", image: "images/../../private.webp" }] },
    { blocks: [{ type: "image", image: "https://example.com/image.webp" }] }
  ]) {
    await config(root, directory, value);
    await assert.rejects(() => syncContent(root, true), /broken-product\/details\/config.json/);
  }
});
