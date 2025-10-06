import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaChartLine, FaUsers, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminAnalyticsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch all bookings data
  const [packageBookings, transferBookings, dailyTourBookings] = await Promise.all([
    prisma.booking.findMany({
      select: {
        id: true,
        totalPrice: true,
        currency: true,
        status: true,
        packageName: true,
        createdAt: true,
        userId: true,
        agentId: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transferBooking.findMany({
      select: {
        id: true,
        totalPrice: true,
        currency: true,
        status: true,
        createdAt: true,
        agentId: true,
        transfer: {
          include: {
            fromLocation: true,
            toLocation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.dailyTourBooking.findMany({
      select: {
        id: true,
        totalPrice: true,
        currency: true,
        status: true,
        createdAt: true,
        agentId: true,
        tour: {
          select: {
            title: true,
            tourCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  // Filter out cancelled bookings from statistics
  const activePackageBookings = packageBookings.filter(b => b.status !== 'CANCELLED');
  const activeTransferBookings = transferBookings.filter(b => b.status !== 'CANCELLED');
  const activeDailyTourBookings = dailyTourBookings.filter(b => b.status !== 'CANCELLED');

  const totalActiveBookings = activePackageBookings.length + activeTransferBookings.length + activeDailyTourBookings.length;

  // Calculate confirmed bookings (conversion)
  const confirmedPackages = activePackageBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const confirmedTransfers = activeTransferBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const confirmedDailyTours = activeDailyTourBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const totalConfirmed = confirmedPackages + confirmedTransfers + confirmedDailyTours;

  // Conversion rate (confirmed / total active)
  const conversionRate = totalActiveBookings > 0 ? ((totalConfirmed / totalActiveBookings) * 100).toFixed(1) : '0';

  // Calculate total revenue (confirmed bookings only, excluding cancelled, in EUR)
  const packageRevenue = activePackageBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const transferRevenue = activeTransferBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const dailyTourRevenue = activeDailyTourBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalRevenue = packageRevenue + transferRevenue + dailyTourRevenue;

  // Average booking value
  const avgBookingValue = totalConfirmed > 0 ? (totalRevenue / totalConfirmed).toFixed(2) : '0';

  // Most popular packages (top 5) - excluding cancelled
  const packageCounts: Record<string, number> = {};
  activePackageBookings.forEach(b => {
    packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1;
  });
  const topPackages = Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Most popular daily tours (top 5) - excluding cancelled
  const tourCounts: Record<string, number> = {};
  activeDailyTourBookings.forEach(b => {
    const tourName = `${b.tour.title} (${b.tour.tourCode})`;
    tourCounts[tourName] = (tourCounts[tourName] || 0) + 1;
  });
  const topTours = Object.entries(tourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Most popular transfer routes (top 5) - excluding cancelled
  const routeCounts: Record<string, number> = {};
  activeTransferBookings.forEach(b => {
    const route = `${b.transfer.fromLocation.name} → ${b.transfer.toLocation.name}`;
    routeCounts[route] = (routeCounts[route] || 0) + 1;
  });
  const topRoutes = Object.entries(routeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // B2C vs B2B breakdown - excluding cancelled
  const b2cPackages = activePackageBookings.filter(b => !b.agentId).length;
  const b2bPackages = activePackageBookings.filter(b => b.agentId).length;
  const b2cTransfers = activeTransferBookings.filter(b => !b.agentId).length;
  const b2bTransfers = activeTransferBookings.filter(b => b.agentId).length;
  const b2cDailyTours = activeDailyTourBookings.filter(b => !b.agentId).length;
  const b2bDailyTours = activeDailyTourBookings.filter(b => b.agentId).length;

  // Monthly bookings (last 6 months) - excluding cancelled
  const now = new Date();

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthPackages = activePackageBookings.filter(b =>
      b.createdAt >= monthStart && b.createdAt <= monthEnd
    ).length;
    const monthTransfers = activeTransferBookings.filter(b =>
      b.createdAt >= monthStart && b.createdAt <= monthEnd
    ).length;
    const monthDailyTours = activeDailyTourBookings.filter(b =>
      b.createdAt >= monthStart && b.createdAt <= monthEnd
    ).length;

    return {
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      packages: monthPackages,
      transfers: monthTransfers,
      dailyTours: monthDailyTours,
      total: monthPackages + monthTransfers + monthDailyTours,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/images/FunnyLogo1.png"
                alt="Funny Tourism"
                width={120}
                height={50}
                className="object-contain"
              />
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                <FaArrowLeft className="inline mr-2" />
                Back to Dashboard
              </Link>
              <span className="text-gray-600">Welcome, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{totalActiveBookings}</p>
                <p className="text-xs text-gray-500 mt-1">{totalConfirmed} confirmed · excl. cancelled</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaChartLine className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Confirmed bookings</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaStar className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">€{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Confirmed only</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaMoneyBillWave className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Booking Value</p>
                <p className="text-3xl font-bold text-orange-600">€{avgBookingValue}</p>
                <p className="text-xs text-gray-500 mt-1">Per confirmed booking</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <FaUsers className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Types Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Package Bookings</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-gray-900">{activePackageBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">{confirmedPackages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-purple-600">€{packageRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Transfer Bookings</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-gray-900">{activeTransferBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">{confirmedTransfers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-purple-600">€{transferRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Tour Bookings</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-semibold text-gray-900">{activeDailyTourBookings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="font-semibold text-green-600">{confirmedDailyTours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-purple-600">€{dailyTourRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* B2C vs B2B */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">B2C vs B2B Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Direct Customers (B2C)</span>
                <span className="text-lg font-bold text-blue-600">{b2cPackages + b2cTransfers + b2cDailyTours}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Packages:</span>
                  <span>{b2cPackages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfers:</span>
                  <span>{b2cTransfers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Tours:</span>
                  <span>{b2cDailyTours}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Agent Bookings (B2B)</span>
                <span className="text-lg font-bold text-teal-600">{b2bPackages + b2bTransfers + b2bDailyTours}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Packages:</span>
                  <span>{b2bPackages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfers:</span>
                  <span>{b2bTransfers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Tours:</span>
                  <span>{b2bDailyTours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Trends (Last 6 Months)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Packages</th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Transfers</th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Daily Tours</th>
                  <th className="text-right py-2 px-4 text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-900">{data.month}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700">{data.packages}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700">{data.transfers}</td>
                    <td className="py-2 px-4 text-sm text-right text-gray-700">{data.dailyTours}</td>
                    <td className="py-2 px-4 text-sm text-right font-semibold text-gray-900">{data.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Packages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Packages</h3>
            <div className="space-y-3">
              {topPackages.length > 0 ? (
                topPackages.map(([name, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No package bookings yet</p>
              )}
            </div>
          </div>

          {/* Top Daily Tours */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Daily Tours</h3>
            <div className="space-y-3">
              {topTours.length > 0 ? (
                topTours.map(([name, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
                    <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-1 rounded">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No daily tour bookings yet</p>
              )}
            </div>
          </div>

          {/* Top Transfer Routes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Transfer Routes</h3>
            <div className="space-y-3">
              {topRoutes.length > 0 ? (
                topRoutes.map(([route, count], index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 flex-1 truncate">{route}</span>
                    <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No transfer bookings yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Note about Google Analytics */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Additional Analytics</h4>
          <p className="text-sm text-blue-800">
            For detailed visitor analytics including bounce rate, time on site, filter usage patterns, and mobile vs desktop conversion,
            check your <strong>Google Analytics dashboard</strong> (ID: G-5FM0WYP1P4) and <strong>Yandex.Metrika</strong> (ID: 100532902).
          </p>
        </div>
      </div>
    </div>
  );
}
