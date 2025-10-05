import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting safe transfer migration...\n');

  // Step 1: Delete all transfer bookings first (due to foreign key)
  const deletedBookings = await prisma.transferBooking.deleteMany({});
  console.log(`✓ Deleted ${deletedBookings.count} transfer bookings`);

  // Step 2: Delete all transfers
  const deletedTransfers = await prisma.transfer.deleteMany({});
  console.log(`✓ Deleted ${deletedTransfers.count} transfers`);

  console.log('\n✅ Transfer tables cleared successfully!');
  console.log('All other data (packages, tours, users, bookings, etc.) preserved.\n');
  console.log('Next steps:');
  console.log('1. Run: npx prisma db push (without --force-reset)');
  console.log('2. Run: npx tsx scripts/seed-transfer-locations.ts');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
