const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG with modern aesthetic for Urgut Today
function createIconSvg(size, maskable = false) {
  const padding = maskable ? Math.round(size * 0.15) : 0;
  const innerSize = size - padding * 2;
  const rx = maskable ? 0 : Math.round(size * 0.22);
  const fontSize = Math.round(innerSize * 0.44);
  const subFontSize = Math.round(innerSize * 0.11);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="50%" stop-color="#b91c1c" />
        <stop offset="100%" stop-color="#991b1b" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#ef4444" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="${Math.max(2, Math.round(size * 0.015))}" stdDeviation="${Math.max(3, Math.round(size * 0.02))}" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>

    ${maskable 
      ? `<rect width="${size}" height="${size}" fill="#b91c1c" />`
      : `<rect width="${size}" height="${size}" rx="${rx}" fill="url(#bgGrad)" />`
    }

    <!-- Subtle decorative glow circle -->
    <circle cx="${size * 0.85}" cy="${size * 0.15}" r="${size * 0.3}" fill="#ffffff" opacity="0.08" />

    <!-- Corner badge element -->
    <rect x="${padding + innerSize * 0.15}" y="${padding + innerSize * 0.12}" width="${innerSize * 0.7}" height="${innerSize * 0.02}" fill="url(#accentGrad)" rx="${innerSize * 0.01}" />

    <!-- Text UT -->
    <g filter="url(#shadow)">
      <text
        x="${size / 2}"
        y="${size / 2 + fontSize * 0.32}"
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-weight="900"
        font-size="${fontSize}"
        fill="#ffffff"
        text-anchor="middle"
        letter-spacing="-1.5"
      >UT</text>
    </g>

    <!-- Subtitle TODAY -->
    <text
      x="${size / 2}"
      y="${size / 2 + fontSize * 0.32 + subFontSize * 1.5}"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      font-weight="800"
      font-size="${subFontSize}"
      fill="#fecaca"
      text-anchor="middle"
      letter-spacing="3"
    >URGUT TODAY</text>
  </svg>
  `;
}

async function run() {
  const sizes = [
    { name: 'icon-192x192.png', size: 192, maskable: false },
    { name: 'icon-512x512.png', size: 512, maskable: false },
    { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'favicon-32x32.png', size: 32, maskable: false },
    { name: 'favicon-16x16.png', size: 16, maskable: false },
  ];

  for (const { name, size, maskable } of sizes) {
    const svg = createIconSvg(size, maskable);
    const dest = path.join(iconsDir, name);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(dest);
    console.log(`Generated: ${dest}`);
  }

  // Also create a standalone apple-touch-icon in public/
  const appleSvg = createIconSvg(180, false);
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));

  console.log('All icons generated successfully!');
}

run().catch(console.error);
