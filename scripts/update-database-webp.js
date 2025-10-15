/**
 * Update database image references from JPG/JPEG/PNG to WebP
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stats = {
  destinations: 0,
  packages: 0,
  dailyTours: 0,
  totalChanges: 0
};

function convertPathToWebp(path) {
  if (!path) return path;
  return path
    .replace(/\.jpg$/i, '.webp')
    .replace(/\.jpeg$/i, '.webp')
    .replace(/\.png$/i, '.webp');
}

function updateJsonImages(jsonString) {
  if (!jsonString) return jsonString;

  try {
    const data = JSON.parse(jsonString);

    // Handle arrays (like attractions)
    if (Array.isArray(data)) {
      return JSON.stringify(data.map(item => {
        if (item.image) {
          item.image = convertPathToWebp(item.image);
        }
        return item;
      }));
    }

    // Handle objects
    if (typeof data === 'object') {
      for (const key in data) {
        if (typeof data[key] === 'string' && data[key].includes('/images/')) {
          data[key] = convertPathToWebp(data[key]);
        } else if (typeof data[key] === 'object') {
          data[key] = JSON.parse(updateJsonImages(JSON.stringify(data[key])));
        }
      }
      return JSON.stringify(data);
    }

    return jsonString;
  } catch (e) {
    return jsonString;
  }
}

async function updateDestinations() {
  console.log('🗺️  Updating Destination images...');

  const destinations = await prisma.destination.findMany();

  for (const dest of destinations) {
    let updated = false;
    const updates = {};

    // Update hero image
    if (dest.heroImage) {
      const newHeroImage = convertPathToWebp(dest.heroImage);
      if (newHeroImage !== dest.heroImage) {
        updates.heroImage = newHeroImage;
        updated = true;
      }
    }

    // Update attractions images
    if (dest.attractions) {
      const newAttractions = updateJsonImages(dest.attractions);
      if (newAttractions !== dest.attractions) {
        updates.attractions = newAttractions;
        updated = true;
      }
    }

    if (updated) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: updates
      });
      console.log(`  ✅ Updated ${dest.name}`);
      stats.destinations++;
      stats.totalChanges++;
    }
  }
}

async function updatePackages() {
  console.log('\n📦 Updating Package images...');

  const packages = await prisma.package.findMany();

  for (const pkg of packages) {
    let updated = false;
    const updates = {};

    // Update main image
    if (pkg.image) {
      const newImage = convertPathToWebp(pkg.image);
      if (newImage !== pkg.image) {
        updates.image = newImage;
        updated = true;
      }
    }

    // Update hotels JSON if it contains images
    if (pkg.hotels) {
      const newHotels = updateJsonImages(pkg.hotels);
      if (newHotels !== pkg.hotels) {
        updates.hotels = newHotels;
        updated = true;
      }
    }

    if (updated) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: updates
      });
      console.log(`  ✅ Updated ${pkg.title}`);
      stats.packages++;
      stats.totalChanges++;
    }
  }
}

async function updateDailyTours() {
  console.log('\n🎯 Updating Daily Tour images...');

  const tours = await prisma.dailyTour.findMany();

  for (const tour of tours) {
    if (tour.image) {
      const newImage = convertPathToWebp(tour.image);
      if (newImage !== tour.image) {
        await prisma.dailyTour.update({
          where: { id: tour.id },
          data: { image: newImage }
        });
        console.log(`  ✅ Updated ${tour.title}`);
        stats.dailyTours++;
        stats.totalChanges++;
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting database update to WebP references...\n');

  try {
    await updateDestinations();
    await updatePackages();
    await updateDailyTours();

    console.log('\n' + '='.repeat(60));
    console.log('📊 UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Destinations updated: ${stats.destinations}`);
    console.log(`Packages updated: ${stats.packages}`);
    console.log(`Daily Tours updated: ${stats.dailyTours}`);
    console.log(`Total records changed: ${stats.totalChanges}`);
    console.log('='.repeat(60));

    console.log('\n✅ Database update complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test the website to ensure all images load correctly');
    console.log('   2. Check a few destination pages, packages, and tours');
    console.log('   3. Once confirmed, you can remove old JPG/PNG files');

  } catch (error) {
    console.error('❌ Error updating database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
