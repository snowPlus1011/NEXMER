import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await mkdir('.sites-runtime', { recursive: true });
const temporary = await mkdtemp(path.join(process.cwd(), '.sites-runtime/ssr-'));
const options = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };
let compiled = ts.transpileModule(await readFile('app/site.tsx', 'utf8'), { compilerOptions: options }).outputText;
compiled = compiled.replaceAll('@/lib/content-core.mjs', '../../lib/content-core.mjs').replaceAll('@/lib/content-types', './content-types.mjs');
await writeFile(path.join(temporary, 'site.mjs'), compiled);
await writeFile(path.join(temporary, 'content-types.mjs'), ts.transpileModule(await readFile('lib/content-types.ts', 'utf8'), { compilerOptions: options }).outputText);
const { default: Site } = await import(pathToFileURL(path.join(temporary, 'site.mjs')).href);
const content = JSON.parse(await readFile('generated/content.json', 'utf8'));
const render = props => renderToStaticMarkup(React.createElement(Site, { initialContent: content, ...props }));
const count = (text, value) => text.split(value).length - 1;
test('home renders fixed-section anchor targets and all configured featured links', () => {
  const html = render({ mode: 'home' });
  for (const id of ['about', 'products', 'support']) assert.ok(html.includes(`id="${id}"`));
  assert.equal(count(html, 'class="product-card"'), content.featured.length);
  assert.ok(html.includes('href="/products?category=all"'));
  assert.ok(html.includes('class="support-contact-panel"'));
  assert.ok(!html.includes('<form'));
  assert.ok(!html.includes('<textarea'));
});
test('category deep links render only matching products and invalid categories fall back to all', () => {
  const electronics = render({ mode: 'catalog', initialCategory: 'electronics' });
  assert.equal(count(electronics, 'class="product-card"'), 3);
  const clothing = render({ mode: 'catalog', initialCategory: 'clothing' });
  assert.equal(count(clothing, 'class="product-card"'), 1);
  assert.ok(clothing.includes('href="/products/everyday-apparel"'));
  assert.equal(count(render({ mode: 'catalog', initialCategory: 'missing' }), 'class="product-card"'), content.catalog.length);
});
test('English default and product image count come from the content rather than a fixed layout', () => {
  const english = structuredClone(content); english.navigation.defaultLanguage = 'en';
  const home = renderToStaticMarkup(React.createElement(Site, { initialContent: english, mode: 'home' }));
  assert.ok(home.includes('Smarter living,')); assert.ok(home.includes('About us'));
  const product = english.catalog[0]; product.details = ['/1.webp', '/2.webp', '/3.webp', '/4.webp'].map(image => ({ type: 'image', image }));
  const html = renderToStaticMarkup(React.createElement(Site, { initialContent: english, mode: 'detail', productId: product.id }));
  assert.equal(count(html, 'class="detail-image-button"'), 4);
  assert.ok(html.includes('href="/#support"'));
});
test('mixed details render in JSON order with localized paragraphs, captions and safe plain text', () => {
  const mixed = structuredClone(content); mixed.navigation.defaultLanguage = 'en';
  const product = mixed.catalog[0];
  product.details = [
    { type: 'text', title: { zh: '中文标题', en: 'Overview first' }, body: { zh: '中文正文', en: 'First paragraph\n\nSecond paragraph' } },
    { type: 'image', image: '/ordered-image.webp', alt: { zh: '外观', en: 'Exterior view' }, caption: { en: 'Image caption' } },
    { type: 'text', title: { zh: '单语言也可展示' }, body: '<script>alert("example")</script>' },
    { type: 'image', image: '/last-image.webp' }
  ];
  const html = renderToStaticMarkup(React.createElement(Site, { initialContent: mixed, mode: 'detail', productId: product.id }));
  const detail = html.slice(html.indexOf('class="detail-content detail-images"'));
  assert.ok(detail.indexOf('Overview first') < detail.indexOf('href="/ordered-image.webp"'));
  assert.ok(detail.indexOf('href="/ordered-image.webp"') < detail.indexOf('单语言也可展示'));
  assert.ok(detail.indexOf('单语言也可展示') < detail.indexOf('href="/last-image.webp"'));
  assert.ok(detail.includes('<p>First paragraph</p><p>Second paragraph</p>'));
  assert.ok(detail.includes('alt="Exterior view"'));
  assert.ok(detail.includes('<figcaption class="detail-caption">Image caption</figcaption>'));
  assert.ok(detail.includes('&lt;script&gt;'));
  assert.ok(!detail.includes('<script>'));
  assert.equal(count(detail, 'class="detail-image-button"'), 2);
  assert.ok(html.includes('04 detail sections'));
  assert.ok(detail.includes('01 / 02')); assert.ok(detail.includes('02 / 02'));
});
test('support exposes only configured contact links and never a submission form', () => {
  const configured = structuredClone(content);
  configured.support.email = 'sales@example.com';
  configured.support.whatsapp = '+44 7700 900123';
  const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'home' }));
  assert.ok(html.includes('href="mailto:sales@example.com"'));
  assert.ok(html.includes('href="https://wa.me/447700900123"'));
  assert.ok(!html.includes('<form')); assert.ok(!html.includes('<textarea'));
  assert.ok(!html.includes('/api/'));
  configured.support.email = ''; configured.support.whatsapp = '';
  const pending = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'home' }));
  assert.ok(pending.includes('联系方式待补充'));
  assert.ok(!pending.includes('href="mailto:')); assert.ok(!pending.includes('href="https://wa.me/'));
});
after(async () => { await rm(temporary, { recursive: true, force: true }); });
