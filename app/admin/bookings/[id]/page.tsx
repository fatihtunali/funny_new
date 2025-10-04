import { redirect, notFound } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaHotel, FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import LogoutButton from '@/components/admin/LogoutButton';
import BookingActions from '@/components/admin/BookingActions';

export default async function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const customerName = booking.user?.name || booking.guestName;
  const customerEmail = booking.user?.email || booking.guestEmail;
  const customerPhone = booking.user?.phone || booking.guestPhone;
  const isGuest = !booking.userId;

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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Booking Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/bookings" className="text-blue-600 hover:text-blue-800">
                <FaArrowLeft className="inline mr-2" />
                Back to Bookings
              </Link>
              <span className="text-gray-600">Welcome, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Information</h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  booking.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'COMPLETED'
                    ? 'bg-blue-100 text-blue-800'
                    : booking.status === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-semibold text-gray-600">Reference Number</span>
                  <span className="text-lg font-bold text-blue-600">{booking.referenceNumber}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-semibold text-gray-600">Booking Date</span>
                  <span className="text-sm text-gray-900">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-semibold text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'REFUNDED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                {isGuest && (
                  <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                    Guest Booking
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{customerName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${customerEmail}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {customerEmail}
                    </a>
                  </div>
                </div>

                {customerPhone && (
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-3 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href={`tel:${customerPhone}`} className="text-sm font-semibold text-blue-600 hover:underline">
                        {customerPhone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Package Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Package Name</p>
                  <p className="text-lg font-bold text-gray-900">{booking.packageName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCalendar className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Travel Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.travelDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaHotel className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Hotel Category</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.hotelCategory.replace('star', '-Star')} Hotels
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUsers className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Travelers</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.adults} {booking.adults === 1 ? 'Adult' : 'Adults'}
                      {booking.children3to5 > 0 && `, ${booking.children3to5} Child(ren) 3-5`}
                      {booking.children6to10 > 0 && `, ${booking.children6to10} Child(ren) 6-10`}
                    </p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Special Requests</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600">Currency</span>
                  <span className="text-sm font-semibold text-gray-900">{booking.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {booking.currency} {booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <BookingActions
              bookingId={booking.id}
              currentStatus={booking.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
