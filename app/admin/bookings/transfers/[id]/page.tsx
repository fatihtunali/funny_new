import { redirect, notFound } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaCar, FaUsers, FaClock, FaMapMarkerAlt, FaPlane } from 'react-icons/fa';
import LogoutButton from '@/components/admin/LogoutButton';
import TransferBookingActions from '@/components/admin/TransferBookingActions';

export default async function AdminTransferBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const booking = await prisma.transferBooking.findUnique({
    where: { id },
    include: {
      transfer: {
        include: {
          fromLocation: true,
          toLocation: true,
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

  if (!booking) {
    notFound();
  }

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
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Transfer Booking Details</h1>
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
                  <span className="text-lg font-bold text-purple-600">{booking.referenceNumber}</span>
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

                {booking.agent && (
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-sm font-semibold text-gray-600">Booked via Agent</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{booking.agent.companyName}</div>
                      <div className="text-xs text-gray-500">{booking.agent.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-3 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.guestName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 mr-3 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${booking.guestEmail}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {booking.guestEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaPhone className="text-gray-400 mr-3 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${booking.guestPhone}`} className="text-sm font-semibold text-blue-600 hover:underline">
                      {booking.guestPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Transfer Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Route</p>
                  <div className="flex items-center bg-purple-50 p-4 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600 mr-3 text-xl" />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">{booking.transfer.fromLocation.name}</p>
                      <div className="flex items-center my-2">
                        <div className="flex-1 border-t-2 border-dashed border-purple-300"></div>
                        <span className="mx-2 text-purple-600">→</span>
                        <div className="flex-1 border-t-2 border-dashed border-purple-300"></div>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{booking.transfer.toLocation.name}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaCalendar className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Transfer Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.transferDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Transfer Time</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.transferTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCar className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Vehicle Type</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.vehicleType}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUsers className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Number of Passengers</p>
                    <p className="text-sm font-semibold text-gray-900">{booking.numberOfPassengers}</p>
                  </div>
                </div>

                {booking.flightNumber && (
                  <div className="flex items-center">
                    <FaPlane className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Flight Number</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.flightNumber}</p>
                    </div>
                  </div>
                )}

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
                  <span className="text-2xl font-bold text-purple-600">
                    {booking.currency} {booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <TransferBookingActions
              bookingId={booking.id}
              currentStatus={booking.status}
              customerPhone={booking.guestPhone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
