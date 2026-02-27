const fs = require('fs');
const path = require('path');

// Create a simple JPEG placeholder for OG image
// This creates a minimal valid JPEG structure
const createOGImage = () => {
  // JPEG header (SOI - Start of Image)
  const SOI = Buffer.from([0xFF, 0xD8]);
  
  // JFIF APP0 marker
  const APP0 = Buffer.concat([
    Buffer.from([0xFF, 0xE0]), // APP0 marker
    Buffer.from([0x00, 0x10]), // Length
    Buffer.from('JFIF\0', 'ascii'), // Identifier
    Buffer.from([0x01, 0x01]), // Version
    Buffer.from([0x00]), // Units
    Buffer.from([0x00, 0x01, 0x00, 0x01]), // X/Y density
    Buffer.from([0x00, 0x00]) // Thumbnail
  ]);
  
  // Create a simple 1x1 orange pixel JPEG
  // SOF0 (Start of Frame)
  const SOF0 = Buffer.concat([
    Buffer.from([0xFF, 0xC0]), // SOF0 marker
    Buffer.from([0x00, 0x11]), // Length
    Buffer.from([0x08]), // Precision
    Buffer.from([0x00, 0x01, 0x00, 0x01]), // Height and Width (1x1)
    Buffer.from([0x03]), // Components
    Buffer.from([0x01, 0x11, 0x00]), // Y component
    Buffer.from([0x02, 0x11, 0x01]), // Cb component
    Buffer.from([0x03, 0x11, 0x01])  // Cr component
  ]);
  
  // EOI (End of Image)
  const EOI = Buffer.from([0xFF, 0xD9]);
  
  // Combine all parts
  const jpegBuffer = Buffer.concat([SOI, APP0, SOF0, EOI]);
  
  const ogImagePath = path.join(__dirname, '..', 'public', 'og-image.jpg');
  fs.writeFileSync(ogImagePath, jpegBuffer);
  console.log('Created og-image.jpg');
};

createOGImage();