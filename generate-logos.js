const opentype = require('opentype.js');
const fs = require('fs');

// 纯色：浅棕色（取代渐变），用于图标和 GEO 文字
const GOLD = '#c8a97e';
// 深一档的棕（暗色模式下的阴影色）
const GOLD_DARK = '#b08d62';
// AI 四芒星颜色
const STAR_COLOR = '#bae6fd';
// 暗色模式文字
const TEXT_DARK = '#f0ece6';
// 亮色模式文字
const TEXT_LIGHT = '#1a1a1a';

async function main() {
    // 加载字体
    const zodiak = await opentype.load('/tmp/zodiak_fonts/Zodiak_Complete/Fonts/WEB/fonts/Zodiak-Bold.ttf');
    const clash = await opentype.load('/tmp/clash_fonts/ClashGrotesk_Complete/Fonts/WEB/fonts/ClashGrotesk-Semibold.ttf');
    const noto = await opentype.load('/tmp/NotoSansSC-Medium.ttf');

    console.log('Fonts loaded successfully!');

    // 测量文字宽度来精确计算 x 坐标
    const skuSize = 32;
    const geoSize = 32;
    const baseline = 40;

    // Sku 文字 path
    const skuPath = zodiak.getPath('Sku', 68, baseline, skuSize);
    const skuBBox = skuPath.getBoundingBox();
    const skuWidth = skuBBox.x2 - skuBBox.x1;
    console.log('Sku bbox:', skuBBox, 'width:', skuWidth);

    // GEO 起始坐标 = Sku 右边界 + 3px 间距
    const geoX = Math.ceil(skuBBox.x2) + 3;
    const geoPath = clash.getPath('GEO', geoX, baseline, geoSize);
    const geoBBox = geoPath.getBoundingBox();
    console.log('GEO bbox:', geoBBox, 'geoX:', geoX);

    // 中文 "拾鸽"
    const zhSize = 30;
    const shiPath = noto.getPath('拾', 72, baseline, zhSize);
    const shiBBox = shiPath.getBoundingBox();
    const geZhX = Math.ceil(shiBBox.x2) + 8;
    const gePath = noto.getPath('鸽', geZhX, baseline, zhSize);
    const geBBox = gePath.getBoundingBox();
    console.log('拾 bbox:', shiBBox, '鸽 bbox:', geBBox);

    // SVG 总宽度（取决于英文/中文最宽的那个 + 余量）
    const enTotalWidth = Math.ceil(geoBBox.x2) + 14;
    const zhTotalWidth = Math.ceil(geBBox.x2) + 14;
    console.log('EN total width:', enTotalWidth, 'ZH total width:', zhTotalWidth);

    // 图标部分（放大镜 + 微笑 + AI星）—— 纯色版本
    function iconSvg(filterType) {
        const shadowOpacity = filterType === 'dark' ? '0.25' : '0.12';
        return `
  <defs>
    <filter id="lensGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="2.5" flood-color="${GOLD}" flood-opacity="${shadowOpacity}"/>
    </filter>
  </defs>
  <g transform="translate(10, 8)">
    <g filter="url(#lensGlow)">
      <circle cx="22" cy="22" r="16" stroke="${GOLD}" stroke-width="3.5" fill="none"/>
      <line x1="33" y1="33" x2="44" y2="44" stroke="${GOLD}" stroke-width="4.5" stroke-linecap="round"/>
    </g>
    <path d="M 13 25 Q 22 34 31 25" stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 17 8 Q 17 15 10 15 Q 17 15 17 22 Q 17 15 24 15 Q 17 15 17 8 Z" fill="${STAR_COLOR}"/>
  </g>`;
    }

    // logo.svg (暗色英文)
    const logoDarkEn = `<svg width="${enTotalWidth}" height="56" viewBox="0 0 ${enTotalWidth} 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>SkuGEO</title>${iconSvg('dark')}
  <path d="${skuPath.toPathData(2)}" fill="${TEXT_DARK}"/>
  <path d="${geoPath.toPathData(2)}" fill="${GOLD}"/>
  <line x1="68" y1="48" x2="${enTotalWidth - 14}" y2="48" stroke="${GOLD}" stroke-width="0.8" stroke-linecap="round" opacity="0.35"/>
</svg>`;

    // logo-light.svg (亮色英文)
    const logoLightEn = `<svg width="${enTotalWidth}" height="56" viewBox="0 0 ${enTotalWidth} 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>SkuGEO</title>${iconSvg('light')}
  <path d="${skuPath.toPathData(2)}" fill="${TEXT_LIGHT}"/>
  <path d="${geoPath.toPathData(2)}" fill="${GOLD_DARK}"/>
  <line x1="68" y1="48" x2="${enTotalWidth - 14}" y2="48" stroke="${GOLD_DARK}" stroke-width="0.8" stroke-linecap="round" opacity="0.25"/>
</svg>`;

    // logo-zh.svg (暗色中文)
    const logoDarkZh = `<svg width="${zhTotalWidth}" height="56" viewBox="0 0 ${zhTotalWidth} 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>拾鸽</title>${iconSvg('dark')}
  <path d="${shiPath.toPathData(2)}" fill="${TEXT_DARK}"/>
  <path d="${gePath.toPathData(2)}" fill="${GOLD}"/>
  <line x1="72" y1="48" x2="${zhTotalWidth - 14}" y2="48" stroke="${GOLD}" stroke-width="0.8" stroke-linecap="round" opacity="0.35"/>
</svg>`;

    // logo-zh-light.svg (亮色中文)
    const logoLightZh = `<svg width="${zhTotalWidth}" height="56" viewBox="0 0 ${zhTotalWidth} 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>拾鸽</title>${iconSvg('light')}
  <path d="${shiPath.toPathData(2)}" fill="${TEXT_LIGHT}"/>
  <path d="${gePath.toPathData(2)}" fill="${GOLD_DARK}"/>
  <line x1="72" y1="48" x2="${zhTotalWidth - 14}" y2="48" stroke="${GOLD_DARK}" stroke-width="0.8" stroke-linecap="round" opacity="0.25"/>
</svg>`;

    // favicon.svg (纯色版，透明背景)
    const favicon = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>SkuGEO</title>
  <defs>
    <filter id="lensGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="2" dy="3" stdDeviation="3.5" flood-color="${GOLD}" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g transform="translate(6, 6)">
    <g filter="url(#lensGlow)">
      <circle cx="22" cy="22" r="18" stroke="${GOLD}" stroke-width="4.5" fill="none"/>
      <line x1="35" y1="35" x2="52" y2="52" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>
    </g>
    <path d="M 12 25 Q 22 35 32 25" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M 17 6 Q 17 14 9 14 Q 17 14 17 22 Q 17 14 25 14 Q 17 14 17 6 Z" fill="${STAR_COLOR}"/>
  </g>
</svg>`;

    fs.writeFileSync('public/logo.svg', logoDarkEn);
    fs.writeFileSync('public/logo-light.svg', logoLightEn);
    fs.writeFileSync('public/logo-zh.svg', logoDarkZh);
    fs.writeFileSync('public/logo-zh-light.svg', logoLightZh);
    fs.writeFileSync('public/favicon.svg', favicon);

    console.log('✅ All 5 SVG files generated successfully!');
    console.log('  - public/logo.svg (dark EN)');
    console.log('  - public/logo-light.svg (light EN)');
    console.log('  - public/logo-zh.svg (dark ZH)');
    console.log('  - public/logo-zh-light.svg (light ZH)');
    console.log('  - public/favicon.svg');
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
