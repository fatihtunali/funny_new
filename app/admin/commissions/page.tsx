import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/admin/LogoutButton';
import MarkAsPaidButton from '@/components/admin/MarkAsPaidButton';

export default async function AdminCommissionsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch all agent bookings with commissions
  const packageBookings = await prisma.booking.findMany({
    where: { agentId: { not: null } },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  });

  const dailyTourBookings = await prisma.dailyTourBooking.findMany({
    where: { agentId: { not: null } },
    include: { agent: true, tour: true },
    orderBy: { createdAt: 'desc' },
  });

  const transferBookings = await prisma.transferBooking.findMany({
    where: { agentId: { not: null } },
    include: { agent: true, transfer: { include: { fromLocation: true, toLocation: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate totals
  const totalCommissions = [
    ...packageBookings.map(b => b.commissionAmount || 0),
    ...dailyTourBookings.map(b => b.commissionAmount || 0),
    ...transferBookings.map(b => b.commissionAmount || 0),
  ].reduce((sum, amount) => sum + amount, 0);

  const pendingCommissions = [
    ...packageBookings.filter(b => !b.fullyPaidAt).map(b => (b.commissionAmount || 0) - (b.paidAmount || 0)),
    ...dailyTourBookings.filter(b => !b.fullyPaidAt).map(b => (b.commissionAmount || 0) - (b.paidAmount || 0)),
    ...transferBookings.filter(b => !b.fullyPaidAt).map(b => (b.commissionAmount || 0) - (b.paidAmount || 0)),
  ].reduce((sum, amount) => sum + amount, 0);

  const paidCommissions = [
    ...packageBookings.map(b => b.paidAmount || 0),
    ...dailyTourBookings.map(b => b.paidAmount || 0),
    ...transferBookings.map(b => b.paidAmount || 0),
  ].reduce((sum, amount) => sum + amount, 0);

  // Combine all bookings
  const allBookings = [
    ...packageBookings.map(b => ({ ...b, type: 'Package', serviceName: b.packageName })),
    ...dailyTourBookings.map(b => ({ ...b, type: 'Daily Tour', serviceName: b.tour.title })),
    ...transferBookings.map(b => ({ ...b, type: 'Transfer', serviceName: `${b.transfer.fromLocation.name} → ${b.transfer.toLocation.name}` })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Image
                  src="/images/FunnyLogo1.png"
                  alt="Funny Tourism"
                  width={120}
                  height={50}
                  className="object-contain cursor-pointer"
                />
              </Link>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Agent Commissions</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-gray-600">Welcome, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
            <p className="text-3xl font-bold text-gray-900">€{totalCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
            <p className="text-3xl font-bold text-red-600">€{pendingCommissions.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Paid to Agents</p>
            <p className="text-3xl font-bold text-green-600">€{paidCommissions.toFixed(2)}</p>
          </div>
        </div>

        {/* Commissions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Agent Bookings & Commissions</h2>
          </div>

          {allBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No agent bookings yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBookings.map((booking) => {
                    const paidAmount = booking.paidAmount || 0;
                    const commissionAmount = booking.commissionAmount || 0;
                    const remainingAmount = commissionAmount - paidAmount;

                    return (
                    <tr key={`${booking.type}-${booking.id}`} className={!booking.fullyPaidAt ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.type === 'Package' ? 'bg-blue-100 text-blue-800' :
                          booking.type === 'Daily Tour' ? 'bg-teal-100 text-teal-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {booking.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.agent?.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        €{booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-semibold text-green-600">
                          €{commissionAmount.toFixed(2)}
                          <span className="text-xs text-gray-500 ml-1">({booking.commissionRate}%)</span>
                        </div>
                        {paidAmount > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Paid: €{paidAmount.toFixed(2)} | Remaining: €{remainingAmount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.fullyPaidAt ? (
                          <div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full block mb-1">
                              Fully Paid
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(booking.fullyPaidAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : paidAmount > 0 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Partial ({((paidAmount / commissionAmount) * 100).toFixed(0)}%)
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!booking.fullyPaidAt && (
                          <MarkAsPaidButton
                            bookingId={booking.id}
                            bookingType={booking.type as 'Package' | 'Daily Tour' | 'Transfer'}
                            commissionAmount={commissionAmount}
                            paidAmount={paidAmount}
                          />
                        )}
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
