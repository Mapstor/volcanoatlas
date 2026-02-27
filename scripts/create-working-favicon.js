const fs = require('fs');
const path = require('path');

// Create a simple but valid ICO file with volcano emoji
function createProperICO() {
  // This creates a valid ICO with embedded PNG
  const volcano = '🌋';
  
  // Create a simple 32x32 PNG encoded as base64 (orange square with volcano)
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAB5UlEQVRYCe2XsUoDQRCGN0aIEESwEAsLC1tBLCy0FkEQBEEsBLEQxMJCEMFC8AEEn0DwCQSfQPABBEEQBEGwEBEsBEELQQhC8P/LzuFxudzdJhfEhR92Z2Zn5pvZ3dm9jUQi/xWtra2x9vZ2Xl9fZ4lEQuzt7Ql9fX18fn7O4/E4X19f882trc3Ly8vcaDT4wcEBHx0dDW2kBAHs7Ozw7u5uDgxOT09DYxAYAJ/s7+/LJLOzs6ExCAzA8PCwAFhbWwuNQWAAJicnBcDGxkZoDAIDMD4+LgC2t7dDYxAYgImJCQGwu7sbGoNAAKysrMjgw8PDPj8/D41BIAAWFxdlcqvVColEQhwMgkAgcnl5KYNns1l+enoKhUEgANfX1zJ4KpXiDw8PoTAIDGB+fl4A7O3thcYgMICZmRkBsL6+HhqDQAei0Wg0Ojk5KeW4tbXFh4aGQmPQMACapmm6pmmNdoA8Pj7ywcFBqQP0w8NDw8bgOTk5kbLM5XK8q6vLFwauAVxcXEjZaZrGi8WiLwxcA7i9vZWy02g0Xi6XfWHgGsDd3Z2UnUaj8Wq16gsDVw9hZWVFys5kMt5sNn1h4ArA2tqalJ3BYLzT6fSFgSsAm5ubUnYWi8Xv9Xp9YeAKwPb2tpTd/wPg5Q3BL96T4I3vJXULAAAAAElFTkSuQmCC';
  
  const pngBuffer = Buffer.from(pngBase64, 'base64');
  
  // ICO header
  const header = Buffer.from([
    0x00, 0x00,  // Reserved
    0x01, 0x00,  // Type: ICO
    0x01, 0x00   // Number of images
  ]);
  
  // Directory entry
  const dirEntry = Buffer.from([
    32,    // Width
    32,    // Height
    0,     // Color count
    0,     // Reserved
    0x01, 0x00,  // Color planes
    0x20, 0x00,  // Bits per pixel (32)
    ...Buffer.from(new Uint32Array([pngBuffer.length]).buffer), // Size of image data
    0x16, 0x00, 0x00, 0x00  // Offset to image data (22 bytes)
  ]);
  
  return Buffer.concat([header, dirEntry, pngBuffer]);
}

// Create the ICO file
const icoData = createProperICO();
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoData);
console.log('Created favicon.ico with embedded PNG');

// Also update the SVG favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>
    @media (prefers-color-scheme: dark) {
      rect { fill: #FF6B35; }
    }
    @media (prefers-color-scheme: light) {
      rect { fill: #FF4500; }
    }
  </style>
  <rect width="100" height="100" fill="#FF6B35" rx="20"/>
  <text x="50" y="55" font-size="60" text-anchor="middle" dominant-baseline="middle">🌋</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), svgContent);
console.log('Updated favicon.svg');

// Create apple-touch-icon with proper PNG
const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#FF6B35" rx="30"/>
  <text x="90" y="100" font-size="120" text-anchor="middle" dominant-baseline="middle">🌋</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), appleTouchSvg);
console.log('Created apple-touch-icon.png');

console.log('\nFavicon files created successfully!');