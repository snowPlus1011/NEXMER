import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
import { syncContent } from "./sync-content.mjs";
import { loadSiteRenderer, renderPage } from "./render-page.mjs";

const root = process.cwd();
const { snapshot } = await syncContent(root);
// Empty the old output so removed products and previous server files are gone.
await rm(path.join(root, "dist"), { recursive: true, force: true });
await build();
const template = await readFile(path.join(root, "dist/index.html"), "utf8");
const renderer = await loadSiteRenderer(root);
try {
  const pages = [
    ["index.html", { mode: "home" }],
    ["products/index.html", { mode: "catalog", initialCategory: "all" }],
    ...snapshot.catalog.map(product => [`products/${product.id}/index.html`, { mode: "detail", productId: product.id }]),
    ["404.html", { mode: "detail", productId: "" }]
  ];
  for (const [filename, options] of pages) {
    const file = path.join(root, "dist", filename);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, renderPage(template, snapshot, options, renderer.render));
  }
  console.log(`静态网站已生成：${pages.length} 个 HTML 页面。将 dist 文件夹整体放到静态网站服务器即可。`);
} finally {
  await renderer.close();
}
