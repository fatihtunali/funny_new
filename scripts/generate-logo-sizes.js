/**
 * Generate different logo sizes for marketing
 *
 * This script uses Sharp (image processing library) to create
 * various logo sizes for Google Ads, social media, and web use.
 *
 * Run: node scripts/generate-logo-sizes.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_LOGO = path.join(__dirname, '../public/images/FunnyLogo1.png');
const OUTPUT_DIR = path.join(__dirname, '../public/images/logos');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sizes = [
  // Google Ads
  { name: 'google-ads-landscape', width: 1200, height: 300, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'google-ads-square', width: 1200, height: 1200, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'google-ads-logo', width: 512, height: 128, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },

  // Social Media
  { name: 'facebook-profile', width: 180, height: 180, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'facebook-cover', width: 820, height: 312, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'instagram-profile', width: 320, height: 320, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'twitter-header', width: 1500, height: 500, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'linkedin-logo', width: 400, height: 400, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },

  // Website
  { name: 'header', width: 300, height: 100, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'header-2x', width: 600, height: 200, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'og-image', width: 1200, height: 630, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'apple-touch-icon', width: 180, height: 180, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },

  // Favicon sizes
  { name: 'favicon-16', width: 16, height: 16, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'favicon-32', width: 32, height: 32, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
  { name: 'favicon-48', width: 48, height: 48, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },

  // Email
  { name: 'email-signature', width: 200, height: 67, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },

  // Print (High Resolution)
  { name: 'print-hires', width: 2820, height: 950, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } },
];

async function generateLogos() {
  console.log('📐 Generating logo sizes...\n');

  for (const size of sizes) {
    try {
      const outputPath = path.join(OUTPUT_DIR, `${size.name}.png`);

      await sharp(INPUT_LOGO)
        .resize(size.width, size.height, {
          fit: size.fit,
          background: size.background
        })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outputPath);

      console.log(`✅ ${size.name}.png (${size.width}x${size.height})`);
    } catch (error) {
      console.error(`❌ Error creating ${size.name}:`, error.message);
    }
  }

  console.log('\n✨ Logo generation complete!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n📋 Generated files:');
  console.log('  Google Ads: google-ads-landscape.png, google-ads-square.png, google-ads-logo.png');
  console.log('  Social Media: facebook-profile.png, instagram-profile.png, twitter-header.png');
  console.log('  Website: header.png, og-image.png, favicon-*.png');
  console.log('  Email: email-signature.png');
  console.log('  Print: print-hires.png');
}

// Check if Sharp is installed
try {
  require.resolve('sharp');
  generateLogos().catch(console.error);
} catch (e) {
  console.error('❌ Sharp package not found. Installing...');
  console.log('Run: npm install sharp --save-dev');
  console.log('Then run: node scripts/generate-logo-sizes.js');
}
