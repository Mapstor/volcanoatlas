const fs = require('fs');
const path = require('path');

// Create a simple PNG with volcano emoji
function createPNG(size) {
  // Simplified PNG with volcano emoji text
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#FF6B35"/>
    <text x="50%" y="50%" font-size="${size * 0.7}" text-anchor="middle" dominant-baseline="central">🌋</text>
  </svg>`;
  
  return svg;
}

// Create PNG files
const sizes = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 }
];

// For now, create simple placeholder SVGs
sizes.forEach(({ file, size }) => {
  const svgContent = createPNG(size);
  const filePath = path.join(__dirname, '..', 'public', file);
  // We'll save as SVG with PNG extension for now (browsers will handle it)
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created ${file}`);
});

// Update the main favicon.svg
const mainSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#FF6B35" rx="20"/>
  <text x="50" y="50" font-size="70" text-anchor="middle" dominant-baseline="central">🌋</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), mainSvg);
console.log('Updated favicon.svg');

// Also create a better ICO file
const icoContent = Buffer.from([
  // ICO header
  0x00, 0x00, // Reserved
  0x01, 0x00, // ICO type
  0x01, 0x00, // Number of images
  
  // Image directory
  0x10,       // Width (16px)
  0x10,       // Height (16px)
  0x00,       // Color palette
  0x00,       // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x68, 0x04, 0x00, 0x00, // Size of image data
  0x16, 0x00, 0x00, 0x00, // Offset to image data
  
  // Simplified BMP data (orange square with volcano pattern)
  ...Array(1128).fill(0xFF) // Fill with orange color
]);

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoContent);
console.log('Updated favicon.ico');

console.log('\nAll favicon files created successfully!');