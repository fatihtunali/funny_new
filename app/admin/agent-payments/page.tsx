import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/admin/LogoutButton';
import RecordAgentPaymentButton from '@/components/admin/RecordAgentPaymentButton';

export default async function AdminAgentPaymentsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch all agent bookings (exclude CANCELLED) - these are bookings where agents owe us money
  const packageBookings = await prisma.booking.findMany({
    where: {
      agentId: { not: null },
      status: { not: 'CANCELLED' }
    },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  });

  const dailyTourBookings = await prisma.dailyTourBooking.findMany({
    where: {
      agentId: { not: null },
      status: { not: 'CANCELLED' }
    },
    include: { agent: true, tour: true },
    orderBy: { createdAt: 'desc' },
  });

  const transferBookings = await prisma.transferBooking.findMany({
    where: {
      agentId: { not: null },
      status: { not: 'CANCELLED' }
    },
    include: { agent: true, transfer: { include: { fromLocation: true, toLocation: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate totals (Amount agent owes us = totalPrice - commission)
  const calculateAmountOwed = (totalPrice: number, commission: number) => totalPrice - commission;

  const totalAmountOwed = [
    ...packageBookings.map(b => calculateAmountOwed(b.totalPrice, b.commissionAmount || 0)),
    ...dailyTourBookings.map(b => calculateAmountOwed(b.totalPrice, b.commissionAmount || 0)),
    ...transferBookings.map(b => calculateAmountOwed(b.totalPrice, b.commissionAmount || 0)),
  ].reduce((sum, amount) => sum + amount, 0);

  const totalReceived = [
    ...packageBookings.map(b => b.agentPaidAmount || 0),
    ...dailyTourBookings.map(b => b.agentPaidAmount || 0),
    ...transferBookings.map(b => b.agentPaidAmount || 0),
  ].reduce((sum, amount) => sum + amount, 0);

  const totalPending = [
    ...packageBookings.filter(b => !b.agentFullyPaidAt).map(b => {
      const owed = calculateAmountOwed(b.totalPrice, b.commissionAmount || 0);
      return owed - (b.agentPaidAmount || 0);
    }),
    ...dailyTourBookings.filter(b => !b.agentFullyPaidAt).map(b => {
      const owed = calculateAmountOwed(b.totalPrice, b.commissionAmount || 0);
      return owed - (b.agentPaidAmount || 0);
    }),
    ...transferBookings.filter(b => !b.agentFullyPaidAt).map(b => {
      const owed = calculateAmountOwed(b.totalPrice, b.commissionAmount || 0);
      return owed - (b.agentPaidAmount || 0);
    }),
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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Agent Payments Received</h1>
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
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Agent Payments:</strong> Track money received from agents for customer bookings.
                Amount owed = Total Booking Price - Agent Commission
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Amount Owed by Agents</p>
            <p className="text-3xl font-bold text-gray-900">€{totalAmountOwed.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">(Booking Price - Commission)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Pending from Agents</p>
            <p className="text-3xl font-bold text-red-600">€{totalPending.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Outstanding payments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Received from Agents</p>
            <p className="text-3xl font-bold text-green-600">€{totalReceived.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Already paid by agents</p>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Agent Bookings & Payments</h2>
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
                      Booking Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Owes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBookings.map((booking) => {
                    const commission = booking.commissionAmount || 0;
                    const amountOwed = booking.totalPrice - commission;
                    const paidByAgent = booking.agentPaidAmount || 0;
                    const remainingFromAgent = amountOwed - paidByAgent;

                    return (
                    <tr key={`${booking.type}-${booking.id}`} className={!booking.agentFullyPaidAt ? 'bg-yellow-50' : ''}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-semibold text-gray-900">€{booking.totalPrice.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Commission: €{commission.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-semibold text-blue-600">
                          €{amountOwed.toFixed(2)}
                        </div>
                        {paidByAgent > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Paid: €{paidByAgent.toFixed(2)} | Remaining: €{remainingFromAgent.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.agentFullyPaidAt ? (
                          <div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full block mb-1">
                              Fully Paid
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(booking.agentFullyPaidAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : paidByAgent > 0 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Partial ({((paidByAgent / amountOwed) * 100).toFixed(0)}%)
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!booking.agentFullyPaidAt && (
                          <RecordAgentPaymentButton
                            bookingId={booking.id}
                            bookingType={booking.type as 'Package' | 'Daily Tour' | 'Transfer'}
                            amountOwed={amountOwed}
                            paidAmount={paidByAgent}
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
