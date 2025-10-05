import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import LogoutButton from '@/components/admin/LogoutButton';
import BookingsTabs from '@/components/admin/BookingsTabs';

export default async function AdminBookingsPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  // Fetch all booking types
  const packageBookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      agent: {
        select: {
          companyName: true,
          email: true,
        },
      },
    },
  });

  const transferBookings = await prisma.transferBooking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      transfer: {
        include: {
          fromLocation: true,
          toLocation: true,
        },
      },
    },
  });

  const dailyTourBookings = await prisma.dailyTourBooking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tour: true,
    },
  }).catch(() => []); // Graceful fallback if table doesn't exist yet

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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Bookings Management</h1>
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

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingsTabs
          packageBookings={packageBookings as never[]}
          transferBookings={transferBookings as never[]}
          dailyTourBookings={dailyTourBookings as never[]}
        />
      </div>
    </div>
  );
}
