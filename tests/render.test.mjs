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
const escapedText = value => renderToStaticMarkup(React.createElement(React.Fragment, null, value));
test('home renders fixed-section anchor targets and all configured featured links', () => {
  const html = render({ mode: 'home' });
  for (const id of ['about', 'products', 'support']) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('id="products" class="categories-section'));
  assert.ok(html.indexOf('aria-labelledby="categories-title"') < html.indexOf('aria-labelledby="products-title"'));
  assert.equal(count(html, 'class="product-card"'), content.featured.length);
  assert.ok(html.includes('href="/products?category=all"'));
  assert.ok(html.includes('class="support-contact-panel"'));
  assert.ok(!html.includes('<form'));
  assert.ok(!html.includes('<textarea'));
});
test('category deep links render only matching products and invalid categories fall back to all', () => {
  const expected = {
    electronics: ['ai-companion-pet', 'ai-smart-glasses', 'ai-smart-lamp'],
    'home-living': ['dt088-toaster'],
    'fragrance-beauty': ['wendan-pomelo-fragrance'],
    clothing: ['tang-dynasty-ramie-hanfu']
  };
  for (const [category, ids] of Object.entries(expected)) {
    const html = render({ mode: 'catalog', initialCategory: category });
    const products = [...html.matchAll(/class="product-card" href="\/products\/([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(products, ids);
  }
  assert.equal(count(render({ mode: 'catalog', initialCategory: 'missing' }), 'class="product-card"'), content.catalog.length);
});

test('home shows four category cards with the requested subjects while catalog retains all-products filtering', () => {
  const html = render({ mode: 'home' });
  const cards = [...html.matchAll(/class="category-card category-([^"]+)" href="([^"]+)"/g)];
  assert.deepEqual(cards.map(match => match[1]), ['electronics', 'home-living', 'fragrance-beauty', 'clothing']);
  assert.deepEqual(cards.map(match => match[2]), ['/products?category=electronics', '/products?category=home-living', '/products?category=fragrance-beauty', '/products?category=clothing']);
  for (const file of ['smart-electronics.png', 'home-living.jpg', 'fragrance-beauty.png', 'fashion-culture.jpg']) assert.ok(html.includes(`/resources/products/categories/images/${file}`));
  assert.ok(html.includes('object-position:50% 0%'));
  assert.ok(!html.includes('category-card category-all'));
  const catalog = render({ mode: 'catalog' });
  assert.ok(catalog.includes('id="tab-all"'));
  assert.equal(count(catalog, 'role="tab"'), 5);
  assert.ok(catalog.includes('Smart Electronics'));
  assert.ok(catalog.includes('Home &amp; Living'));
  assert.ok(catalog.includes('Fragrance &amp; Beauty'));
  assert.ok(catalog.includes('Fashion &amp; Culture'));
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
  product.detailsLayout = 'spaced';
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
  configured.support.email = ''; configured.support.whatsapp = ''; configured.support.whatsappQrImage = '';
  const pending = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'home' }));
  assert.ok(!pending.includes('class="contact-row'));
  assert.ok(!pending.includes('href="mailto:')); assert.ok(!pending.includes('href="https://wa.me/'));
});

test('configured public contacts render the supplied email and QR code in both languages', () => {
  assert.equal(content.support.email, 'maje.nexmer@gmail.com');
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'home' }));
    assert.ok(html.includes('href="mailto:maje.nexmer@gmail.com"'));
    assert.ok(html.includes(`src="${configured.support.whatsappQrImage}"`));
    assert.ok(html.includes(configured.support.whatsappQrLabel[language]));
    assert.ok(!html.includes('class="contact-pending"'));
    assert.ok(!html.includes('href="https://wa.me/"'));
  }
});

test('all customer pages omit draft notices, image disclaimers and unfinished contact labels', () => {
  const disallowed = /样稿|示意图|待补充|可替换|sample (?:product|collection)|illustrative|coming soon/i;
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const pages = [{ mode: 'home' }, { mode: 'catalog' }, ...configured.catalog.map(product => ({ mode: 'detail', productId: product.id }))];
    for (const page of pages) {
      const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, ...page }));
      assert.ok(!disallowed.test(html), `${language} ${page.mode} ${page.productId ?? ''}`);
    }
  }
});

test('Light Seeker switches all eight original image links and descriptions with the chosen language', () => {
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const product = configured.catalog.find(item => item.id === 'ai-smart-lamp');
    const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'detail', productId: product.id }));
    assert.ok(html.includes('class="detail-content detail-images detail-seamless"'));
    assert.ok(html.includes(product.name[language]));
    const links = [...html.matchAll(/class="detail-image-button" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, Array.from({ length: 8 }, (_, i) => `/resources/products/catalog/ai-smart-lamp/details/images/${language}/${String(i + 1).padStart(2, '0')}.png`));
    assert.ok(!links.some(link => link.includes(`/images/${language === 'en' ? 'zh' : 'en'}/`)));
    assert.ok(!html.includes('01 / 08'));
  }
});

test('Light Seeker homepage and catalog cards share extracted bilingual content and configured covers', () => {
  const catalog = content.catalog.find(item => item.id === 'ai-smart-lamp');
  const featured = content.featured.find(item => item.id === catalog.id);
  assert.deepEqual(featured.name, catalog.name);
  assert.deepEqual(featured.summary, catalog.summary);
  assert.ok(catalog.image.endsWith('/images/light-seeker-cover.png'));
  assert.ok(featured.image.endsWith('/images/light-seeker-cover.png'));
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    for (const mode of ['home', 'catalog']) {
      const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode }));
      assert.ok(html.includes(catalog.name[language]));
      assert.ok(html.includes(catalog.summary[language]));
      assert.ok(html.includes(mode === 'home' ? featured.image : catalog.image));
    }
  }
});

test('Pomelo fragrance renders seven paired original images and matching homepage/catalog cards', () => {
  const product = content.catalog.find(item => item.id === 'wendan-pomelo-fragrance');
  const featured = content.featured.find(item => item.id === product.id);
  assert.equal(product.category, 'fragrance-beauty');
  assert.equal(product.details.length, 7);
  assert.deepEqual(featured.name, product.name);
  assert.deepEqual(featured.summary, product.summary);
  assert.ok(featured.image.endsWith('/images/pomelo-fragrance-cover.png'));
  assert.ok(product.image.endsWith('/images/pomelo-fragrance-cover.png'));
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'detail', productId: product.id }));
    const links = [...html.matchAll(/class="detail-image-button" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, Array.from({ length: 7 }, (_, i) => `/resources/products/catalog/wendan-pomelo-fragrance/details/images/${language}/${String(i + 1).padStart(2, '0')}.png`));
    assert.ok(html.includes('class="detail-content detail-images detail-seamless"'));
    for (const mode of ['home', 'catalog']) {
      const page = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode }));
      assert.ok(page.includes(product.name[language]));
      assert.ok(page.includes(product.summary[language]));
      assert.ok(page.includes(mode === 'home' ? featured.image : product.image));
    }
    const fragrance = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'catalog', initialCategory: 'fragrance-beauty' }));
    assert.ok(fragrance.includes('href="/products/wendan-pomelo-fragrance"'));
  }
});
test('Tang Dynasty Hanfu preserves each language’s numbered eight-image order and matching product cards', () => {
  const product = content.catalog.find(item => item.id === 'tang-dynasty-ramie-hanfu');
  const featured = content.featured.find(item => item.id === product.id);
  assert.equal(product.category, 'clothing');
  assert.equal(product.details.length, 8);
  assert.equal(product.name.en, 'Tang Dynasty Mural-Inspired Ramie Hanfu');
  assert.equal(product.name.zh, '中国盛唐汉服');
  assert.deepEqual(featured.name, product.name);
  assert.deepEqual(featured.summary, product.summary);
  assert.ok(product.image.endsWith('/images/hanfu-cover.png'));
  assert.ok(featured.image.endsWith('/images/hanfu-cover.png'));
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'detail', productId: product.id }));
    assert.ok(html.includes('class="detail-content detail-images detail-seamless"'));
    const links = [...html.matchAll(/class="detail-image-button" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, Array.from({ length: 8 }, (_, i) => `/resources/products/catalog/${product.id}/details/images/${language}/${String(i + 1).padStart(2, '0')}.png`));
    assert.ok(!html.includes('01 / 08'));
    for (const mode of ['home', 'catalog']) {
      const page = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode }));
      assert.ok(page.includes(product.name[language]));
      assert.ok(page.includes(product.summary[language]));
      assert.ok(page.includes(mode === 'home' ? featured.image : product.image));
    }
  }
});
for (const spec of [
  { id: 'dt088-toaster', category: 'home-living', count: 4, en: 'DT088 2-Slice Toaster', zh: 'DT088 双槽多士炉' },
  { id: 'ai-companion-pet', category: 'electronics', count: 5, en: 'AI Companion Pet', zh: 'AI 陪伴宠物' },
  { id: 'ai-smart-glasses', category: 'electronics', count: 5, en: 'AI Smart Glasses AG18', zh: 'AI 智能眼镜 AG18' }
]) test(`${spec.id} switches ordered bilingual images and shares extracted homepage/catalog content`, () => {
  const product = content.catalog.find(item => item.id === spec.id);
  const featured = content.featured.find(item => item.id === product.id);
  assert.equal(product.category, spec.category);
  assert.equal(product.details.length, spec.count);
  assert.equal(product.name.en, spec.en);
  assert.equal(product.name.zh, spec.zh);
  assert.deepEqual(featured.name, product.name);
  assert.deepEqual(featured.summary, product.summary);
  for (const language of ['en', 'zh']) {
    const configured = structuredClone(content); configured.navigation.defaultLanguage = language;
    const detail = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode: 'detail', productId: product.id }));
    assert.ok(detail.includes('class="detail-content detail-images detail-seamless"'));
    const links = [...detail.matchAll(/class="detail-image-button" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links, Array.from({ length: spec.count }, (_, i) => `/resources/products/catalog/${spec.id}/details/images/${language}/${String(i + 1).padStart(2, '0')}.png`));
    assert.ok(!detail.includes(`01 / ${String(spec.count).padStart(2, '0')}`));
    for (const mode of ['home', 'catalog']) {
      const html = renderToStaticMarkup(React.createElement(Site, { initialContent: configured, mode }));
      assert.ok(html.includes(escapedText(product.name[language])));
      assert.ok(html.includes(escapedText(product.summary[language])));
      assert.ok(html.includes(mode === 'home' ? featured.image : product.image));
    }
  }
});
after(async () => { await rm(temporary, { recursive: true, force: true }); });
