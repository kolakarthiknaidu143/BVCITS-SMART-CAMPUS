import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';

const svg = fs.readFileSync('src/assets/bvcits-logo.svg', 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 600,
  },
  font: {
    loadSystemFonts: true,
  },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync('src/assets/bvcits-logo.png', pngBuffer);
fs.writeFileSync('public/bvcits-logo.png', pngBuffer);

console.log('Successfully generated src/assets/bvcits-logo.png (' + pngBuffer.length + ' bytes) and public/bvcits-logo.png');
