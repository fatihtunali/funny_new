const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPackageImages() {
  try {
    // Get all packages
    const packages = await prisma.package.findMany();

    console.log(`Found ${packages.length} packages to update\n`);

    for (const pkg of packages) {
      let newImage = pkg.image;
      const destinations = pkg.destinations.toLowerCase();

      // Map to correct existing images based on destinations
      if (destinations.includes('istanbul') && destinations.includes('kusadasi')) {
        newImage = '/images/Ephesus_Library.jpg';
      } else if (destinations.includes('istanbul') && destinations.includes('cappadocia')) {
        newImage = '/images/cappadociaballoonride.jpg';
      } else if (destinations.includes('istanbul')) {
        newImage = '/images/BlueMosqueIstanbul.jpg';
      } else if (destinations.includes('cappadocia')) {
        newImage = '/images/FairyChimneysCapppadocia.jpeg';
      } else if (destinations.includes('kusadasi') || destinations.includes('ephesus')) {
        newImage = '/images/Ephesus_Library.jpg';
      } else if (destinations.includes('pamukkale')) {
        newImage = '/images/PamukkaleTravertenler.jpg';
      } else if (destinations.includes('antalya')) {
        newImage = '/images/AntalyaHarbour.jpg';
      } else if (destinations.includes('fethiye')) {
        newImage = '/images/FethiyeMarina.jpg';
      } else {
        // Default to hotel package image
        newImage = '/images/hotelwithpackage.jpg';
      }

      if (newImage !== pkg.image) {
        await prisma.package.update({
          where: { id: pkg.id },
          data: { image: newImage }
        });
        console.log(`✓ Updated ${pkg.packageId} - ${pkg.title}`);
        console.log(`  Old: ${pkg.image}`);
        console.log(`  New: ${newImage}\n`);
      } else {
        console.log(`✓ ${pkg.packageId} - ${pkg.title} - Image already correct\n`);
      }
    }

    console.log('\n✅ All packages updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPackageImages();
