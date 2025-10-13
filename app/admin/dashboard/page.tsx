import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaEye, FaEnvelope, FaChartLine, FaUsers, FaSearch, FaFileImport } from 'react-icons/fa';
import LogoutButton from '@/components/admin/LogoutButton';
import DeletePackageButton from '@/components/admin/DeletePackageButton';

export default async function AdminDashboard() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const packages = await prisma.package.findMany({
    orderBy: { packageId: 'asc' },
  });

  const dailyTours = await prisma.dailyTour.findMany({
    orderBy: { tourCode: 'asc' },
  });

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unrepliedInquiriesCount = inquiries.filter(i => !i.replied).length;

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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/analytics" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Analytics</p>
                <p className="text-lg font-semibold text-blue-600">View Metrics →</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaChartLine className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/bookings" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Manage Bookings</p>
                <p className="text-lg font-semibold text-blue-600">View All Bookings →</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaEye className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/packages/add" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Create Package</p>
                <p className="text-lg font-semibold text-green-600">Add New Package →</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaPlus className="text-2xl text-green-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/import" className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white mb-2">Import from AI ✨</p>
                <p className="text-lg font-semibold text-white">Ruzgar Gucu AI →</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <FaFileImport className="text-2xl text-white" />
              </div>
            </div>
          </Link>
          <Link href="/admin/blog" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Blog Management</p>
                <p className="text-lg font-semibold text-orange-600">Manage Blog →</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <FaEdit className="text-2xl text-orange-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/agents" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">B2B Agents</p>
                <p className="text-lg font-semibold text-purple-600">Manage Agents →</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaEye className="text-2xl text-purple-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/leads" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Agent Leads</p>
                <p className="text-lg font-semibold text-orange-600">Extract Emails →</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <FaUsers className="text-2xl text-orange-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/discover" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Discover Agents</p>
                <p className="text-lg font-semibold text-blue-600">Find New Leads →</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaSearch className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/daily-tours/add" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Daily Tours</p>
                <p className="text-lg font-semibold text-teal-600">Add Daily Tour →</p>
              </div>
              <div className="bg-teal-100 rounded-full p-3">
                <FaPlus className="text-2xl text-teal-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/transfers/add" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">AI Transfer Pricing</p>
                <p className="text-lg font-semibold text-purple-600">Add Transfer ✨ →</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaPlus className="text-2xl text-purple-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/inquiries" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Inquiries & Quotes</p>
                <p className="text-lg font-semibold text-indigo-600">View Inquiries →</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <FaEnvelope className="text-2xl text-indigo-600" />
              </div>
            </div>
            {unrepliedInquiriesCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {unrepliedInquiriesCount}
              </div>
            )}
          </Link>
          <Link href="/admin/commissions" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Agent Commissions</p>
                <p className="text-lg font-semibold text-green-600">Track Payments →</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaEdit className="text-2xl text-green-600" />
              </div>
            </div>
          </Link>
          <Link href="/admin/agent-payments" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Agent Payments</p>
                <p className="text-lg font-semibold text-blue-600">Money from Agents →</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaEdit className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <FaEdit className="text-2xl text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <FaEye className="text-2xl text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Packages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-teal-100 rounded-full p-3">
                <FaEdit className="text-2xl text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Daily Tours</p>
                <p className="text-2xl font-bold text-gray-900">{dailyTours.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3">
                <FaEye className="text-2xl text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Daily Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dailyTours.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Manage Packages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinations
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
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No packages found. Add your first package to get started.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pkg.packageId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {pkg.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pkg.duration}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pkg.destinations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pkg.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/packages/${pkg.packageId}`}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                          >
                            <FaEye className="inline" />
                          </Link>
                          <Link
                            href={`/admin/packages/edit/${pkg.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FaEdit className="inline" />
                          </Link>
                          <DeletePackageButton packageId={pkg.id} packageTitle={pkg.title} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
