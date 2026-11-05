// Generates the static SEO pages and refreshes sitemap.xml:
// - colors/*.html   brand color charts, from BRAND_PALETTES in app.js
// - patterns/*.html free bead patterns (+ .json for the editor), from tools/patterns.mjs
// - the free-pattern section of index.html (between the patterns:start/end markers)
// Usage: node tools/build-pages.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { COLOR_KEYS, CATEGORIES, PATTERNS } from './patterns.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://beads.dingdongxi.com';
// Cloudflare serves pages without the .html extension (/foo.html redirects to /foo),
// so canonical, Open Graph, structured data and sitemap URLs use the final form.
const pageUrl = (path) => `${SITE}/${path.replace(/\.html$/, '')}`;

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

// Keep a trailing arrow on the same line as the word before it.
const glueArrows = (html) => html.replace(/ →</g, '&nbsp;→<');

function layout({ title, description, path, body, jsonLd }) {
  body = glueArrows(body);
  const url = pageUrl(path);
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
  <footer><div class="footer-links"><a href="../index.html">首頁</a><a href="../editor.html">圖紙製作</a><a href="../patterns/">拼豆圖案</a><a href="../colors/">色號表</a><a href="../privacy.html">隱私權政策</a><a href="../terms.html">使用條款</a><a href="mailto:hokidev26@gmail.com">聯絡我們</a></div><p class="footer-copy">拼豆圖紙產生器 — 免費線上工具 · 色碼資料來源 <a href="https://fusebead.sulian-blog.com" target="_blank" rel="noopener">fusebead.sulian-blog.com</a></p><p class="footer-note">色碼為螢幕顯示的參考值，實際珠子顏色可能因生產批次與螢幕設定略有差異。</p></footer>
</body>
</html>
`;
}

function breadcrumb(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: pageUrl(item.path) })) };
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

// ===== Free patterns =====
const PATTERN_BRAND = 'mard';
const PATTERN_PALETTE = PALETTES[PATTERN_BRAND];

const KEY_TO_ENTRY = Object.fromEntries(Object.entries(COLOR_KEYS).map(([key, code]) => {
  const entry = PATTERN_PALETTE.find((item) => item.code === code);
  if (!entry) throw new Error(`Color key ${key}: ${code} is not a ${PATTERN_BRAND} color`);
  return [key, entry];
}));

const patterns = PATTERNS.map((pattern) => {
  const w = pattern.rows[0].length, h = pattern.rows.length;
  const cells = pattern.rows.map((row, y) => {
    if (row.length !== w) throw new Error(`${pattern.slug}: row ${y} is ${row.length} wide, expected ${w}`);
    return Array.from(row).map((key, x) => {
      if (key === '.') return null;
      if (!KEY_TO_ENTRY[key]) throw new Error(`${pattern.slug}: unknown color key "${key}" at ${x},${y}`);
      return KEY_TO_ENTRY[key];
    });
  });
  if (!CATEGORIES.some((category) => category.id === pattern.category)) throw new Error(`${pattern.slug}: unknown category`);
  const counts = new Map();
  cells.flat().forEach((entry) => { if (entry) counts.set(entry.code, { entry, count: (counts.get(entry.code)?.count || 0) + 1 }); });
  const colors = [...counts.values()].sort((a, b) => b.count - a.count);
  const beads = colors.reduce((sum, item) => sum + item.count, 0);
  const difficulty = beads <= 150 && colors.length <= 5 ? '簡單' : '普通';
  return { ...pattern, w, h, cells, colors, beads, difficulty };
});

function patternSvg(pattern, { label, className = 'pattern-svg' } = {}) {
  const size = 10;
  const shapes = [];
  pattern.cells.forEach((row, y) => row.forEach((entry, x) => {
    const cx = x * size + size / 2, cy = y * size + size / 2;
    shapes.push(entry
      ? `<circle cx="${cx}" cy="${cy}" r="4.3" fill="${entry.hex}"/>`
      : `<circle cx="${cx}" cy="${cy}" r="1.2" fill="#d8d2cb"/>`);
  }));
  const aria = label ? ` role="img" aria-label="${escapeHtml(label)}"` : ' aria-hidden="true"';
  return `<svg class="${className}" viewBox="0 0 ${pattern.w * size} ${pattern.h * size}"${aria} xmlns="http://www.w3.org/2000/svg">${shapes.join('')}</svg>`;
}

function patternCard(pattern, prefix = '') {
  return `<a class="pattern-card" href="${prefix}${pattern.slug}.html">${patternSvg(pattern)}<strong>${escapeHtml(pattern.name)}</strong><span>${pattern.w}×${pattern.h}・${pattern.colors.length} 色・${pattern.difficulty}</span></a>`;
}

const STEPS = [
  '把透明拼豆板放在圖案旁邊，從左上角開始，照著顏色一格一格放上珠子。',
  '放完後對照色號清單檢查一次，確認沒有放錯或漏放。',
  '在珠子上鋪一張燙紙（烘焙紙），熨斗調到中溫、關閉蒸氣。',
  '用畫圈的方式均勻熨燙約 10–20 秒，看到珠子孔洞稍微變小就可以停。',
  '稍微冷卻後把作品從板子上取下，翻面再燙一次，最後壓上重物放涼就會平整。'
];

function patternPage(pattern) {
  const title = `${pattern.name}拼豆圖案（${pattern.w}×${pattern.h}）免費圖紙＋色號清單｜拼豆圖紙產生器`;
  const description = `免費${pattern.name}拼豆圖案，尺寸 ${pattern.w}×${pattern.h}、共 ${pattern.beads} 顆珠子、${pattern.colors.length} 種顏色，附 MARD 色號與用量清單。可直接在線上編輯器修改、下載 PDF 圖紙。`;
  const related = [
    ...patterns.filter((other) => other.category === pattern.category && other.slug !== pattern.slug),
    ...patterns.filter((other) => other.category !== pattern.category)
  ].slice(0, 6);
  const colorRows = pattern.colors.map(({ entry, count }) => `        <li><span class="chart-swatch${isLight(entry.hex) ? ' is-light' : ''}" style="background:${entry.hex}"></span><strong>${escapeHtml(entry.code)}</strong><code>${entry.hex.toUpperCase()}</code><span class="pattern-color-count">${count} 顆</span></li>`).join('\n');
  const body = `    <nav class="chart-breadcrumb" aria-label="導覽路徑"><a href="../index.html">首頁</a> › <a href="index.html">拼豆圖案</a> › <span>${escapeHtml(pattern.name)}</span></nav>
    <article class="pattern-detail">
      <div class="pattern-figure">${patternSvg(pattern, { label: `${pattern.name}拼豆圖案預覽` })}</div>
      <div class="pattern-info">
        <h1>${escapeHtml(pattern.name)}拼豆圖案</h1>
        <p>${escapeHtml(pattern.intro)}</p>
        <ul class="pattern-facts">
          <li><span>尺寸</span><strong>${pattern.w}×${pattern.h}</strong></li>
          <li><span>珠子</span><strong>${pattern.beads} 顆</strong></li>
          <li><span>顏色</span><strong>${pattern.colors.length} 種</strong></li>
          <li><span>難度</span><strong>${pattern.difficulty}</strong></li>
        </ul>
        <a class="btn-primary chart-cta" href="../editor.html?pattern=${pattern.slug}">打開編輯器・下載 PDF →</a>
        <p class="hint">在編輯器裡可以用畫筆、填色、橡皮擦換顏色或修改細節，再下載 PNG 或 PDF 圖紙。</p>
      </div>
    </article>
    <section class="pattern-section">
      <h2>色號與用量（${escapeHtml(BRANDS.find((brand) => brand.id === PATTERN_BRAND).name)}）</h2>
      <ul class="pattern-colors">
${colorRows}
      </ul>
      <p class="hint">建議每種顏色多準備幾顆備用。想用其他品牌？可以參考 <a href="../colors/">拼豆色號表</a> 找相近的顏色。</p>
    </section>
    <section class="pattern-section">
      <h2>製作步驟</h2>
      <ol class="pattern-steps">
${STEPS.map((step) => `        <li>${escapeHtml(step)}</li>`).join('\n')}
      </ol>
    </section>
    <section class="pattern-section">
      <h2>更多拼豆圖案</h2>
      <div class="pattern-grid">
${related.map((other) => `        ${patternCard(other)}`).join('\n')}
      </div>
      <p class="pattern-more-link"><a href="index.html">看全部拼豆圖案 →</a></p>
    </section>`;
  return layout({
    title, description, path: `patterns/${pattern.slug}.html`, body,
    jsonLd: breadcrumb([{ name: '首頁', path: '' }, { name: '拼豆圖案', path: 'patterns/' }, { name: pattern.name, path: `patterns/${pattern.slug}.html` }])
  });
}

function patternIndexPage() {
  const title = `免費拼豆圖案大全｜動物、美食、節慶圖紙＋色號清單｜拼豆圖紙產生器`;
  const description = `${patterns.length} 款免費原創拼豆圖案：柴犬、貓咪、珍珠奶茶、草莓、聖誕樹、南瓜等，附 MARD 色號與用量清單，可直接線上修改、下載 PDF 圖紙。`;
  const sections = CATEGORIES.map((category) => {
    const items = patterns.filter((pattern) => pattern.category === category.id);
    if (!items.length) return '';
    return `    <section class="pattern-section">
      <h2>${escapeHtml(category.name)}</h2>
      <div class="pattern-grid">
${items.map((pattern) => `        ${patternCard(pattern)}`).join('\n')}
      </div>
    </section>`;
  }).join('\n');
  const body = `    <nav class="chart-breadcrumb" aria-label="導覽路徑"><a href="../index.html">首頁</a> › <span>拼豆圖案</span></nav>
    <section class="chart-hero">
      <h1>免費拼豆圖案</h1>
      <p>${patterns.length} 款原創拼豆圖案，每款都附上 MARD 色號、用量清單和製作步驟。點進圖案後可以直接在編輯器打開修改，或下載 PDF 圖紙照著拼。想做自己的圖案？也可以上傳照片自動轉換。</p>
      <a class="btn-primary chart-cta" href="../editor.html">上傳圖片，做自己的拼豆圖案 →</a>
    </section>
${sections}`;
  return layout({
    title, description, path: 'patterns/', body,
    jsonLd: breadcrumb([{ name: '首頁', path: '' }, { name: '拼豆圖案', path: 'patterns/' }])
  });
}

mkdirSync(join(root, 'patterns'), { recursive: true });
writeFileSync(join(root, 'patterns', 'index.html'), patternIndexPage());
patterns.forEach((pattern) => {
  writeFileSync(join(root, 'patterns', `${pattern.slug}.html`), patternPage(pattern));
  writeFileSync(join(root, 'patterns', `${pattern.slug}.json`), JSON.stringify({
    name: pattern.name, brand: PATTERN_BRAND, w: pattern.w, h: pattern.h,
    rows: pattern.cells.map((row) => row.map((entry) => (entry ? entry.code : null)))
  }));
});

// Homepage free-pattern section.
const indexPath = join(root, 'index.html');
const homepage = readFileSync(indexPath, 'utf8');
const START = '<!-- patterns:start -->', END = '<!-- patterns:end -->';
if (!homepage.includes(START) || !homepage.includes(END)) throw new Error('index.html is missing the patterns markers');
const featured = ['shiba', 'bubble-tea', 'cat', 'strawberry', 'rabbit', 'pineapple', 'penguin', 'heart'].map((slug) => patterns.find((pattern) => pattern.slug === slug));
const homeSection = `${START}
    <section class="home-patterns fade-in" aria-labelledby="homePatternsTitle">
      <div class="section-heading">
        <p class="section-kicker">免費下載</p>
        <h2 id="homePatternsTitle">現成拼豆圖案</h2>
      </div>
      <p class="section-desc">不想自己畫？挑一個原創圖案，附色號清單，打開就能修改或下載 PDF。</p>
      <div class="pattern-grid">
${featured.map((pattern) => `        ${patternCard(pattern, 'patterns/')}`).join('\n')}
      </div>
      <p class="pattern-more-link"><a href="patterns/">看全部 ${patterns.length} 款拼豆圖案 →</a></p>
    </section>
    ${END}`;
writeFileSync(indexPath, homepage.slice(0, homepage.indexOf(START)) + glueArrows(homeSection) + homepage.slice(homepage.indexOf(END) + END.length));

const urls = [
  ['', '1.0'], ['editor.html', '0.9'], ['patterns/', '0.8'], ['colors/', '0.8'],
  ...patterns.map((pattern) => [`patterns/${pattern.slug}.html`, '0.7']),
  ...BRANDS.map((brand) => [`colors/${brand.id}.html`, '0.7']),
  ['privacy.html', '0.3'], ['terms.html', '0.3']
];
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, priority]) => `  <url>
    <loc>${pageUrl(path)}</loc>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`);
console.log(`Wrote ${BRANDS.length} color chart pages (${TOTAL_COLORS} colors), ${patterns.length} pattern pages, the homepage pattern section and sitemap.xml`);
