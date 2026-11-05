// Generates the static brand color chart pages (colors/*.html) from the
// BRAND_PALETTES data in app.js, and refreshes sitemap.xml.
// Usage: node tools/build-color-pages.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://beads.dingdongxi.com';

const appSource = readFileSync(join(root, 'app.js'), 'utf8');
const paletteSource = appSource.slice(0, appSource.indexOf('const SYMBOLS'));
const context = {};
vm.runInNewContext(`${paletteSource}\nthis.BRAND_PALETTES = BRAND_PALETTES;`, context);
const PALETTES = context.BRAND_PALETTES;

const BRANDS = [
  { id: 'mard', name: 'MARD' },
  { id: 'hama', name: 'Hama' },
  { id: 'artkal-s', name: 'Artkal S' },
  { id: 'artkal-r', name: 'Artkal R' },
  { id: 'artkal-c', name: 'Artkal C' },
  { id: 'artkal-a', name: 'Artkal A' },
  { id: 'perler', name: 'Perler' },
  { id: 'perler-mini', name: 'Perler Mini' },
  { id: 'nabbi', name: 'Nabbi' }
];

const missing = Object.keys(PALETTES).filter((id) => !BRANDS.some((brand) => brand.id === id));
if (missing.length) throw new Error(`Add display names for: ${missing.join(', ')}`);
const TOTAL_COLORS = BRANDS.reduce((sum, brand) => sum + PALETTES[brand.id].length, 0);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
const isLight = (hex) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6; };

function layout({ title, description, path, body, jsonLd }) {
  const url = `${SITE}/${path}`;
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/demo-beads.png">
  <meta property="og:locale" content="zh_TW">
  <link rel="icon" type="image/png" sizes="64x64" href="../favicon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
  <link rel="apple-touch-icon" href="../favicon.png">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="color-chart-page">
  <header>
    <div class="header-brand"><a href="../index.html" class="header-home"><img src="../favicon.png" width="34" height="34" alt=""><span class="header-site-name">拼豆圖紙產生器</span></a></div>
  </header>
  <main class="chart-main">
${body}
  </main>
  <footer><div class="footer-links"><a href="../index.html">首頁</a><a href="../editor.html">圖紙製作</a><a href="index.html">色號表</a><a href="../privacy.html">隱私權政策</a><a href="../terms.html">使用條款</a><a href="mailto:hokidev26@gmail.com">聯絡我們</a></div><p class="footer-copy">拼豆圖紙產生器 — 免費線上工具 · 色碼資料來源 <a href="https://fusebead.sulian-blog.com" target="_blank" rel="noopener">fusebead.sulian-blog.com</a></p><p class="footer-note">色碼為螢幕顯示的參考值，實際珠子顏色可能因生產批次與螢幕設定略有差異。</p></footer>
</body>
</html>
`;
}

function breadcrumb(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE}/${item.path}` })) };
}

function brandNav(currentId) {
  return `    <nav class="chart-brand-nav" aria-label="其他品牌色號表">
${BRANDS.map((brand) => `      <a href="${brand.id}.html"${brand.id === currentId ? ' aria-current="page"' : ''}>${escapeHtml(brand.name)} <span>${PALETTES[brand.id].length}</span></a>`).join('\n')}
    </nav>`;
}

function brandPage(brand) {
  const colors = PALETTES[brand.id];
  const title = `${brand.name} 拼豆色號表（${colors.length} 色）HEX／RGB 色碼對照｜拼豆圖紙產生器`;
  const description = `${brand.name} 拼豆全部 ${colors.length} 種色號一覽，附 HEX 與 RGB 色碼，可搜尋色號。也能直接用 ${brand.name} 色號把圖片轉成拼豆圖紙，免費、免註冊。`;
  const cards = colors.map((color) => {
    const hex = color.hex.toUpperCase();
    const label = color.name && color.name !== color.code ? `<span class="chart-name">${escapeHtml(color.name)}</span>` : '';
    return `      <li class="chart-card" data-search="${escapeHtml(`${color.code} ${color.name} ${hex}`.toLowerCase())}">
        <span class="chart-swatch${isLight(hex) ? ' is-light' : ''}" style="background:${hex}"></span>
        <strong>${escapeHtml(color.code)}</strong>${label}
        <code>${hex}</code><code class="chart-rgb">RGB ${rgb(hex).join(', ')}</code>
      </li>`;
  }).join('\n');
  const body = `    <nav class="chart-breadcrumb" aria-label="導覽路徑"><a href="../index.html">首頁</a> › <a href="index.html">拼豆色號表</a> › <span>${escapeHtml(brand.name)}</span></nav>
    <section class="chart-hero">
      <h1>${escapeHtml(brand.name)} 拼豆色號表</h1>
      <p>${escapeHtml(brand.name)} 共 <strong>${colors.length}</strong> 種色號。每個顏色都附上 HEX 與 RGB 色碼，方便你對照採購、搭配配色，或自己設計圖案。</p>
      <a class="btn-primary chart-cta" href="../editor.html?brand=${brand.id}">用 ${escapeHtml(brand.name)} 色號把圖片轉成圖紙 →</a>
    </section>
    <div class="chart-search">
      <label for="chartSearch">搜尋色號或色碼</label>
      <input type="search" id="chartSearch" placeholder="例如：${escapeHtml(colors[0].code)} 或 #FF" autocomplete="off">
      <p class="hint" id="chartCount" aria-live="polite">顯示 ${colors.length} 種顏色</p>
    </div>
    <ul class="chart-grid" id="chartGrid">
${cards}
    </ul>
    <section class="chart-more">
      <h2>其他品牌色號表</h2>
${brandNav(brand.id)}
    </section>
    <script>
    (function () {
      var input = document.getElementById('chartSearch');
      var cards = Array.prototype.slice.call(document.querySelectorAll('#chartGrid .chart-card'));
      var count = document.getElementById('chartCount');
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        var shown = 0;
        cards.forEach(function (card) { var match = !query || card.getAttribute('data-search').indexOf(query) !== -1; card.hidden = !match; if (match) shown++; });
        count.textContent = shown ? '顯示 ' + shown + ' 種顏色' : '找不到符合的顏色';
      });
    })();
    </script>`;
  return layout({
    title, description, path: `colors/${brand.id}.html`, body,
    jsonLd: breadcrumb([{ name: '首頁', path: '' }, { name: '拼豆色號表', path: 'colors/' }, { name: brand.name, path: `colors/${brand.id}.html` }])
  });
}

function indexPage() {
  const title = `拼豆色號表大全：MARD、Hama、Artkal、Perler 等 ${BRANDS.length} 品牌 ${TOTAL_COLORS} 色｜拼豆圖紙產生器`;
  const description = `整理 MARD、Hama、Artkal、Perler、Nabbi 等 ${BRANDS.length} 個拼豆品牌共 ${TOTAL_COLORS} 種色號，附 HEX／RGB 色碼，可搜尋。免費線上查詢。`;
  const cards = BRANDS.map((brand) => {
    const colors = PALETTES[brand.id];
    const step = Math.max(1, Math.floor(colors.length / 12));
    const sample = colors.filter((_, index) => index % step === 0).slice(0, 12);
    return `      <a class="chart-brand-card" href="${brand.id}.html">
        <span class="chart-brand-strip">${sample.map((color) => `<i style="background:${color.hex}"></i>`).join('')}</span>
        <strong>${escapeHtml(brand.name)}</strong>
        <span>${colors.length} 種色號</span>
      </a>`;
  }).join('\n');
  const body = `    <nav class="chart-breadcrumb" aria-label="導覽路徑"><a href="../index.html">首頁</a> › <span>拼豆色號表</span></nav>
    <section class="chart-hero">
      <h1>拼豆色號表大全</h1>
      <p>收錄 ${BRANDS.length} 個常見拼豆品牌、共 <strong>${TOTAL_COLORS}</strong> 種色號，每個顏色都附上 HEX 與 RGB 色碼。點選品牌即可查看完整色卡。</p>
      <a class="btn-primary chart-cta" href="../editor.html">上傳圖片，自動產生拼豆圖紙 →</a>
    </section>
    <div class="chart-brand-grid">
${cards}
    </div>`;
  return layout({
    title, description, path: 'colors/', body,
    jsonLd: breadcrumb([{ name: '首頁', path: '' }, { name: '拼豆色號表', path: 'colors/' }])
  });
}

mkdirSync(join(root, 'colors'), { recursive: true });
writeFileSync(join(root, 'colors', 'index.html'), indexPage());
BRANDS.forEach((brand) => writeFileSync(join(root, 'colors', `${brand.id}.html`), brandPage(brand)));

const urls = [
  ['', '1.0'], ['editor.html', '0.9'], ['colors/', '0.8'],
  ...BRANDS.map((brand) => [`colors/${brand.id}.html`, '0.7']),
  ['privacy.html', '0.3'], ['terms.html', '0.3']
];
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, priority]) => `  <url>
    <loc>${SITE}/${path}</loc>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log(`Wrote colors/index.html, ${BRANDS.length} brand pages (${TOTAL_COLORS} colors) and sitemap.xml`);
