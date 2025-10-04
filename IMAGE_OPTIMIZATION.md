# Image Optimization Guide

## Automatic Optimization (Already Implemented)

Next.js automatically optimizes images when using the `<Image>` component:
- Serves images in modern formats (WebP, AVIF) when supported by browsers
- Lazy loads images by default
- Automatically generates responsive image sizes
- Prevents Cumulative Layout Shift (CLS)

## Current Implementation

✅ **Using Next.js Image Component**
- Package cards use `<Image>` component with `fill` prop
- Package detail pages use optimized images
- Proper width/height attributes for better performance

## Manual Conversion (For Existing Images)

To convert existing images to WebP format:

### Using Online Tools:
1. CloudConvert: https://cloudconvert.com/png-to-webp
2. TinyPNG: https://tinypng.com/ (also converts to WebP)

### Using Command Line (ImageMagick):
```bash
# Install ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert single image
convert input.jpg -quality 85 output.webp

# Bulk convert all JPGs in directory
for file in *.jpg; do convert "$file" -quality 85 "${file%.jpg}.webp"; done
```

### Using Node.js Script:
```javascript
// Create a script: scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function convertToWebP(inputPath, outputPath) {
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(outputPath);
}

async function processDirectory(dir) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const ext = path.extname(file).toLowerCase();

    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const outputPath = fullPath.replace(ext, '.webp');
      await convertToWebP(fullPath, outputPath);
      console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
    }
  }
}

// Run: node scripts/convert-images.js
processDirectory('./public/images');
```

## Recommended Image Sizes

| Use Case | Recommended Size | Format |
|----------|-----------------|---------|
| Package Card Images | 800x600px | WebP/JPEG |
| Package Hero Images | 1920x1080px | WebP/JPEG |
| Destination Images | 1200x800px | WebP/JPEG |
| Logo | 300x100px | PNG/WebP |
| Icons | 64x64px | SVG/PNG |

## Performance Best Practices

✅ **Already Implemented:**
- Using Next.js `<Image>` component
- Proper `alt` attributes for SEO
- `priority` prop for above-the-fold images
- Lazy loading for below-the-fold images

🔜 **Future Improvements:**
- Convert all existing images to WebP
- Implement image CDN (Cloudinary, imgix)
- Add placeholder blur images
- Implement progressive image loading

## Testing Image Performance

Use these tools to test image optimization:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Lighthouse (Chrome DevTools)

## Compression Targets

- WebP: Quality 80-85
- JPEG: Quality 80-90
- PNG: Use TinyPNG or pngquant
- Target file sizes:
  - Card images: < 100KB
  - Hero images: < 200KB
  - Thumbnails: < 50KB
