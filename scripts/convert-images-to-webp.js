/**
 * Convert all JPG/JPEG/PNG images to WebP format
 * This script converts images while keeping originals as backup
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../public/images');
const backupDir = path.join(__dirname, '../public/images_backup');

// Statistics
let stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0
};

async function convertImage(filePath, fileName) {
  const ext = path.extname(fileName).toLowerCase();

  // Skip if already webp or not an image
  if (ext === '.webp' || !['.jpg', '.jpeg', '.png'].includes(ext)) {
    stats.skipped++;
    return;
  }

  const baseName = path.basename(fileName, ext);
  const outputPath = path.join(imagesDir, `${baseName}.webp`);

  // Skip if webp version already exists
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${fileName} - WebP version already exists`);
    stats.skipped++;
    return;
  }

  try {
    // Get original file size
    const originalStats = fs.statSync(filePath);
    stats.originalSize += originalStats.size;

    console.log(`🔄 Converting ${fileName}...`);

    // Convert to WebP with quality 85 (good balance between size and quality)
    await sharp(filePath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Get new file size
    const newStats = fs.statSync(outputPath);
    stats.newSize += newStats.size;

    const savedPercent = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);
    console.log(`✅ ${fileName} → ${baseName}.webp (${(originalStats.size / 1024).toFixed(1)}KB → ${(newStats.size / 1024).toFixed(1)}KB, saved ${savedPercent}%)`);

    stats.converted++;
  } catch (error) {
    console.error(`❌ Error converting ${fileName}:`, error.message);
    stats.errors++;
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip backup directory and node_modules
      if (file !== 'images_backup' && file !== 'node_modules') {
        await processDirectory(filePath);
      }
    } else {
      stats.total++;
      await convertImage(filePath, file);
    }
  }
}

async function main() {
  console.log('🚀 Starting image conversion to WebP format...\n');

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    console.log('📁 Creating backup directory...');
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Process all images
  await processDirectory(imagesDir);

  // Print statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images found: ${stats.total}`);
  console.log(`Successfully converted: ${stats.converted}`);
  console.log(`Skipped (already WebP or exists): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New size: ${(stats.newSize / 1024 / 1024).toFixed(2)} MB`);

  if (stats.converted > 0) {
    const totalSaved = stats.originalSize - stats.newSize;
    const percentSaved = (totalSaved / stats.originalSize * 100).toFixed(1);
    console.log(`Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${percentSaved}%)`);
  }

  console.log('='.repeat(60));

  if (stats.converted > 0) {
    console.log('\n✅ Conversion complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update database image references (run update-database-webp.js)');
    console.log('   2. Test the website to ensure all images load correctly');
    console.log('   3. Once confirmed, old JPG/PNG files can be removed');
  } else {
    console.log('\n✅ No conversion needed - all images are already optimized!');
  }
}

main().catch(console.error);
