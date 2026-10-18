import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import React from "react";
import { renderToString } from "react-dom/server";

// React runs here only while generating HTML, never on the website's host.
export async function loadSiteRenderer(projectRoot = process.cwd()) {
  await mkdir(path.join(projectRoot, ".sites-runtime"), { recursive: true });
  const temporary = await mkdtemp(path.join(projectRoot, ".sites-runtime/static-render-"));
  const options = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };
  let compiled = ts.transpileModule(await readFile(path.join(projectRoot, "app/site.tsx"), "utf8"), { compilerOptions: options }).outputText;
  compiled = compiled.replaceAll("@/lib/content-core.mjs", pathToFileURL(path.join(projectRoot, "lib/content-core.mjs")).href).replaceAll("@/lib/content-types", "./content-types.mjs");
  try {
    await writeFile(path.join(temporary, "site.mjs"), compiled);
    await writeFile(path.join(temporary, "content-types.mjs"), ts.transpileModule(await readFile(path.join(projectRoot, "lib/content-types.ts"), "utf8"), { compilerOptions: options }).outputText);
    const { default: Site } = await import(pathToFileURL(path.join(temporary, "site.mjs")).href);
    return { render: props => renderToString(React.createElement(Site, props)), close: () => rm(temporary, { recursive: true, force: true }) };
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
const localize = (value, language) => typeof value === "string" ? value : value?.[language] || value?.zh || value?.en || "";

export function renderPage(template, content, options, render) {
  const language = content.navigation.defaultLanguage === "en" ? "en" : "zh";
  const product = options.mode === "detail" ? content.catalog.find(item => item.id === options.productId) : null;
  const title = product ? `${localize(product.name, language)} | ${content.navigation.brand}` : options.mode === "catalog" ? `${language === "zh" ? "商品目录" : "The collection"} | ${content.navigation.brand}` : `${content.navigation.brand} | ${localize(content.navigation.tagline, language)}`;
  const description = product ? localize(product.summary, language) : content.about.sentences.map(sentence => localize(sentence, language)).join(" ");
  const pageData = JSON.stringify(options).replace(/</g, "\\u003c");
  return template
    .replace('<html lang="zh-CN">', `<html lang="${language === "zh" ? "zh-CN" : "en"}">`)
    .replace("__SITE_TITLE__", () => escapeHTML(title))
    .replace("__SITE_DESCRIPTION__", () => escapeHTML(description))
    .replace('<div id="root"></div>', () => `<div id="root">${render({ initialContent: content, ...options })}</div>`)
    .replace(/(<script id="page-data" type="application\/json">)[\s\S]*?(<\/script>)/, () => `<script id="page-data" type="application/json">${pageData}</script>`);
}
