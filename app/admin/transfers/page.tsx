import { getAdminFromToken } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminTransfersPage() {
  const admin = await getAdminFromToken();
  if (!admin) redirect('/admin/login');

  const transfers = await prisma.transfer.findMany({
    include: {
      fromLocation: true,
      toLocation: true,
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: [
      { fromLocation: { region: 'asc' } },
      { fromLocation: { name: 'asc' } },
    ],
  });

  const groupedTransfers = transfers.reduce((acc, transfer) => {
    const region = transfer.fromLocation.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(transfer);
    return acc;
  }, {} as Record<string, typeof transfers>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfer Management</h1>
            <p className="text-gray-600 mt-2">Manage airport and inter-city transfer routes across Turkey</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/locations"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Manage Locations
            </Link>
            <Link
              href="/admin/transfers/add"
              className="btn-primary"
            >
              + Add New Transfer Route
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Routes</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{transfers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Routes</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {transfers.filter(t => t.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {transfers.reduce((sum, t) => sum + t._count.bookings, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Regions Covered</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {Object.keys(groupedTransfers).length}
            </p>
          </div>
        </div>

        {/* Transfers by Region */}
        {Object.entries(groupedTransfers).map(([region, regionTransfers]) => (
          <div key={region} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{region}</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SIC Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1-2 Pax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      3-5 Pax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      6-10 Pax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regionTransfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transfer.fromLocation.name} → {transfer.toLocation.name}
                        </div>
                        {transfer.distance && (
                          <div className="text-sm text-gray-500">
                            {transfer.distance} • {transfer.duration}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {transfer.fromLocation.type} → {transfer.toLocation.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.sicPricePerPerson ? `€${transfer.sicPricePerPerson}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.price1to2Pax ? `€${transfer.price1to2Pax}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.price3to5Pax ? `€${transfer.price3to5Pax}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.price6to10Pax ? `€${transfer.price6to10Pax}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transfer.isActive ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                        {transfer.onRequestOnly && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            On Request
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer._count.bookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/transfers/edit/${transfer.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {transfers.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No transfer routes found</p>
            <Link href="/admin/transfers/add" className="btn-primary">
              Add Your First Route
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
