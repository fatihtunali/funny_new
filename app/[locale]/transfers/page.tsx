import { prisma } from '@/lib/prisma';
import TransfersClient from '@/components/TransfersClient';

export default async function TransfersPage() {
  // Fetch transfers with location relationships from database at build/request time
  const transfersFromDb = await prisma.transfer.findMany({
    include: {
      fromLocation: true,
      toLocation: true,
    },
    orderBy: [
      { fromLocation: { name: 'asc' } },
      { toLocation: { name: 'asc' } },
    ],
  });

  // Fetch all locations for autocomplete
  const locationsFromDb = await prisma.transferLocation.findMany({
    orderBy: { name: 'asc' },
  });

  // Transform to match expected format
  const transfers = transfersFromDb.map((transfer) => ({
    id: transfer.id,
    fromLocation: {
      id: transfer.fromLocation.id,
      name: transfer.fromLocation.name,
      code: transfer.fromLocation.code || undefined,
      type: transfer.fromLocation.type,
      region: transfer.fromLocation.region,
    },
    toLocation: {
      id: transfer.toLocation.id,
      name: transfer.toLocation.name,
      code: transfer.toLocation.code || undefined,
      type: transfer.toLocation.type,
      region: transfer.toLocation.region,
    },
    sicPricePerPerson: transfer.sicPricePerPerson,
    price1to2Pax: transfer.price1to2Pax,
    price3to5Pax: transfer.price3to5Pax,
    price6to10Pax: transfer.price6to10Pax,
    onRequestOnly: transfer.onRequestOnly,
    vehicleType1to2: transfer.vehicleType1to2,
    vehicleType3to5: transfer.vehicleType3to5,
    vehicleType6to10: transfer.vehicleType6to10,
    duration: transfer.duration,
  }));

  const locations = locationsFromDb.map((loc) => ({
    id: loc.id,
    name: loc.name,
    code: loc.code || undefined,
    type: loc.type,
    region: loc.region,
  }));

  return <TransfersClient transfers={transfers} locations={locations} />;
}
