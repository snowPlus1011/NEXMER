import { readdir, readFile, writeFile, mkdir, cp, rm, access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadContent } from "../lib/content-core.mjs";

const natural = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const imagePattern = /\.(webp|png|jpe?g|avif|svg)$/i;
async function exists(file) { try { await access(file); return true; } catch { return false; } }
async function filesIn(directory, base = "") {
  if (!await exists(directory)) return [];
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`资源目录不支持符号链接：${path.join(directory, entry.name)}`);
    const relative = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) results.push(...await filesIn(path.join(directory, entry.name), relative));
    else if (entry.isFile()) results.push(relative);
  }
  return results.sort(natural.compare);
}
export async function syncContent(projectRoot = process.cwd(), quiet = false) {
  const root = path.join(projectRoot, "resources");
  const output = path.join(projectRoot, "public/resources");
  const index = { version: 2, modules: {}, products: [], featured: [] };
  const warnings = [];
  async function describe(directory, id) {
    const all = await filesIn(path.join(root, directory));
    const config = all.includes("config.json") ? `/resources/${directory}/config.json` : null;
    if (config) {
      let value;
      try { value = JSON.parse(await readFile(path.join(root, directory, "config.json"), "utf8")); }
      catch { throw new Error(`JSON 格式有误，请检查 resources/${directory}/config.json 的逗号和双引号。`); }
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`配置必须为 JSON 对象：resources/${directory}/config.json`);
      for (const key of ["image", "background", "logo", "whatsappQrImage"]) {
        const file = value[key];
        if (!file) continue;
        if (typeof file !== "string" || file.includes("..") || file.startsWith("http") || file.startsWith("/")) {
          throw new Error(`resources/${directory}/config.json 的 ${key} 必须是当前文件夹下的相对图片路径。`);
        }
        if (!all.includes(file)) warnings.push(`resources/${directory}/config.json：找不到 ${file}，将展示默认图片。`);
      }
      if (Array.isArray(value.items)) for (const item of value.items) {
        if (item?.image && (typeof item.image !== "string" || item.image.includes("..") || item.image.startsWith("/") || item.image.startsWith("http"))) throw new Error(`分类图片必须使用当前文件夹相对路径：resources/${directory}/config.json`);
        if (item?.image && !all.includes(item.image)) warnings.push(`分类 ${item.id} 的图片 ${item.image} 缺失，将使用默认图。`);
        if (item?.imagePosition !== undefined) {
          const position = item.imagePosition;
          if (typeof position !== "string" || position.trim().split(/\s+/).length !== 2 || !position.trim().split(/\s+/).every(value => /^\d+(?:\.\d+)?%$/.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100)) throw new Error(`分类 ${item.id} 的 imagePosition 必须是两个 0%–100% 的百分比，例如 50% 0%：resources/${directory}/config.json`);
        }
      }
    }
    const detailsConfig = id && directory.startsWith("products/catalog/") && all.includes("details/config.json") ? `/resources/${directory}/details/config.json` : null;
    if (detailsConfig) {
      const filename = `resources/${directory}/details/config.json`;
      let value;
      try { value = JSON.parse(await readFile(path.join(root, directory, "details/config.json"), "utf8")); }
      catch { throw new Error(`JSON 格式有误，请检查 ${filename} 的逗号和双引号。`); }
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`配置必须为 JSON 对象：${filename}`);
      if (value.blocks !== undefined && !Array.isArray(value.blocks)) throw new Error(`${filename} 的 blocks 必须是图文内容数组。`);
      if (value.layout !== undefined && !["spaced", "seamless"].includes(value.layout)) throw new Error(`${filename} 的 layout 只能为 spaced（留间距）或 seamless（无缝拼接）。`);
      const validText = text => text === undefined || typeof text === "string" || (text && typeof text === "object" && !Array.isArray(text) && Object.keys(text).every(key => ["zh", "en"].includes(key) && typeof text[key] === "string"));
      for (const [position, block] of (value.blocks ?? []).entries()) {
        const location = `${filename} 的 blocks[${position}]`;
        if (!block || !["image", "text"].includes(block.type)) throw new Error(`${location} 的 type 只能为 image（图片）或 text（文字）。`);
        for (const field of block.type === "image" ? ["alt", "caption"] : ["title", "body"]) {
          if (!validText(block[field])) throw new Error(`${location} 的 ${field} 必须是文字或包含 zh / en 的文字对象。`);
        }
        if (block.type === "image") {
          const value = block.image;
          const localized = value && typeof value === "object" && !Array.isArray(value);
          if (typeof value !== "string" && (!localized || !Object.keys(value).length || !Object.keys(value).every(key => ["zh", "en"].includes(key)))) throw new Error(`${location} 的 image 必须是相对图片路径或包含 zh / en 图片路径的对象。`);
          for (const [language, file] of typeof value === "string" ? [["", value]] : Object.entries(value)) {
            const field = `${location} 的 image${language ? `.${language}` : ""}`;
            if (typeof file !== "string" || !file.startsWith("images/") || file.includes("..") || file.includes("\\") || !imagePattern.test(file)) throw new Error(`${field} 必须是详情文件夹内 images/ 开头的相对图片路径。`);
            if (!all.includes(`details/${file}`)) warnings.push(`${field}：找不到 ${file}，将展示另一语言图片、商品封面或默认图片。`);
          }
        }
      }
    }
    const detailImages = all.filter(file => /^details\/images\//.test(file) && imagePattern.test(file));
    return {
      ...(id ? { id } : {}), directory, config, files: all.filter(file => imagePattern.test(file)),
      covers: all.filter(file => /^images\/[^/]+$/.test(file) && imagePattern.test(file)),
      detailsConfig,
      details: detailImages.length ? detailImages : all.filter(file => /^images\/details\/[^/]+$/.test(file) && imagePattern.test(file))
    };
  }
  for (const [key, directory] of Object.entries({ navigation: "navigation", about: "about", products: "products", categories: "products/categories", support: "support" })) index.modules[key] = await describe(directory);
  for (const [key, directory] of [["products", "products/catalog"], ["featured", "products/featured"]]) {
    const absolute = path.join(root, directory);
    if (!await exists(absolute)) continue;
    const entries = (await readdir(absolute, { withFileTypes: true })).filter(entry => entry.isDirectory()).sort((a, b) => natural.compare(a.name, b.name));
    for (const entry of entries) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(entry.name)) throw new Error(`商品文件夹只能使用小写英文、数字和连字符：resources/${directory}/${entry.name}`);
      index[key].push(await describe(`${directory}/${entry.name}`, entry.name));
    }
  }
  const readJSON = async url => JSON.parse(await readFile(path.join(root, url.slice("/resources/".length)), "utf8"));
  const snapshot = await loadContent(index, readJSON);
  for (const entry of index.featured) {
    if (!entry.config) { warnings.push(`${entry.directory} 没有 config.json，不能确定主推商品。`); continue; }
    const featured = await readJSON(entry.config);
    if (featured.enabled !== false && !snapshot.catalog.some(product => product.id === featured.productId)) throw new Error(`主推配置 resources/${entry.directory}/config.json 的 productId 未匹配任何启用的商品。`);
  }
  await mkdir(path.join(projectRoot, "generated"), { recursive: true });
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  if (await exists(root)) await cp(root, output, { recursive: true });
  await writeFile(path.join(output, "index.json"), JSON.stringify(index, null, 2) + "\n");
  await writeFile(path.join(projectRoot, "generated/content.json"), JSON.stringify(snapshot, null, 2) + "\n");
  if (!quiet) {
    for (const warning of warnings) console.warn(`[资源提示] ${warning}`);
    console.log(`内容已同步：${snapshot.catalog.length} 件商品、${snapshot.featured.length} 件主推商品、${snapshot.catalog.reduce((count, product) => count + product.details.length, 0)} 个详情图文块。`);
  }
  return { index, snapshot, warnings };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncContent().catch(error => { console.error(error.message); process.exitCode = 1; });
}
