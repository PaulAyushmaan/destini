const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/images/app-preview.svg'));

sharp(svgBuffer)
  .resize(800, 800)
  .png()
  .toFile(path.join(__dirname, '../public/images/app-preview.png'))
  .then(() => console.log('SVG converted to PNG successfully!'))
  .catch(err => console.error('Error converting SVG to PNG:', err)); 