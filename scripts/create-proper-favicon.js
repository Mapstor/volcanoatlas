const fs = require('fs');
const path = require('path');

// Create a proper volcano-themed favicon
// This creates a minimal but valid ICO file with a volcano icon

function createICO() {
  // ICO file header
  const header = Buffer.from([
    0x00, 0x00, // Reserved
    0x01, 0x00, // Type (1 for ICO)
    0x01, 0x00  // Number of images (1)
  ]);

  // Image directory entry (for 16x16 icon)
  const dirEntry = Buffer.from([
    16,  // Width
    16,  // Height
    0,   // Color palette
    0,   // Reserved
    1, 0, // Color planes
    32, 0, // Bits per pixel (32-bit RGBA)
    0x28, 0x04, 0x00, 0x00, // Size of image data (1064 bytes)
    0x16, 0x00, 0x00, 0x00  // Offset to image data (22 bytes)
  ]);

  // BMP header for the image
  const bmpHeader = Buffer.from([
    0x28, 0x00, 0x00, 0x00, // Header size (40 bytes)
    16, 0x00, 0x00, 0x00,    // Width
    32, 0x00, 0x00, 0x00,    // Height (2x height for AND mask)
    0x01, 0x00,              // Planes
    0x20, 0x00,              // Bits per pixel (32)
    0x00, 0x00, 0x00, 0x00,  // Compression (none)
    0x00, 0x04, 0x00, 0x00,  // Image size
    0x00, 0x00, 0x00, 0x00,  // X pixels per meter
    0x00, 0x00, 0x00, 0x00,  // Y pixels per meter
    0x00, 0x00, 0x00, 0x00,  // Colors used
    0x00, 0x00, 0x00, 0x00   // Important colors
  ]);

  // Create 16x16 pixel data (volcano shape in orange/red)
  const pixels = [];
  
  // Simple volcano shape
  for (let y = 15; y >= 0; y--) {
    for (let x = 0; x < 16; x++) {
      // Create a simple volcano shape
      const centerX = 8;
      const distFromCenter = Math.abs(x - centerX);
      
      if (y < 4) {
        // Sky
        pixels.push(0, 0, 0, 0); // Transparent
      } else if (y < 6 && distFromCenter < 2) {
        // Lava/crater glow
        pixels.push(255, 215, 0, 255); // Gold
      } else if (y < 8 && distFromCenter < 3) {
        // Top of volcano
        pixels.push(255, 69, 0, 255); // Red-orange
      } else if (y < 12 && distFromCenter < (12 - y) * 2) {
        // Volcano slopes
        pixels.push(255, 107, 53, 255); // Orange
      } else {
        // Background
        pixels.push(0, 0, 0, 0); // Transparent
      }
    }
  }

  // AND mask (all opaque for simplicity)
  for (let i = 0; i < 16 * 16 / 8; i++) {
    pixels.push(0);
  }

  const pixelData = Buffer.from(pixels);

  // Combine all parts
  return Buffer.concat([header, dirEntry, bmpHeader, pixelData]);
}

// Create and save the ICO file
const icoData = createICO();
const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(outputPath, icoData);
console.log('Created favicon.ico with volcano icon');

// Also ensure we have the proper link tags in our HTML head
console.log('\nMake sure your app includes these link tags:');
console.log('<link rel="icon" type="image/x-icon" href="/favicon.ico">');
console.log('<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">');