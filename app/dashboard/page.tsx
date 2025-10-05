'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCalendar, FaHotel, FaUsers, FaCheckCircle, FaClock, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  createdAt: string;
  _count: {
    bookings: number;
  };
}

interface Booking {
  id: string;
  referenceNumber: string;
  packageName: string;
  travelDate: string;
  duration: string;
  hotelCategory: string;
  adults: number;
  children3to5: number;
  children6to10: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <FaCheckCircle className="text-green-500" />;
      case 'PENDING':
        return <FaClock className="text-yellow-500" />;
      case 'CANCELLED':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="section-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{user._count.bookings}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaCalendar className="text-primary-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary">
                Book New Trip
              </Link>
            </div>
          </div>

          <div className="p-6">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">You don&apos;t have any bookings yet</p>
                <Link href="/packages/istanbul-cappadocia-kusadasi" className="btn-primary inline-block">
                  Browse Packages
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{booking.packageName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Reference: <span className="font-semibold">{booking.referenceNumber}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {booking.currency === 'EUR' ? '€' : '$'}{booking.totalPrice}
                        </p>
                        <p className="text-xs text-gray-500">{booking.paymentStatus}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-2 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Travel Date</p>
                          <p className="font-semibold">{new Date(booking.travelDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-semibold">{booking.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FaHotel className="mr-2 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Hotel</p>
                          <p className="font-semibold capitalize">{booking.hotelCategory.replace('star', '-Star')}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FaUsers className="mr-2 text-primary-600" />
                        <div>
                          <p className="text-xs text-gray-500">Travelers</p>
                          <p className="font-semibold">
                            {booking.adults} Adults
                            {(booking.children3to5 > 0 || booking.children6to10 > 0) &&
                              `, ${booking.children3to5 + booking.children6to10} Children`
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className="text-sm text-gray-600">
                          {booking.status === 'CONFIRMED' && 'Your booking is confirmed!'}
                          {booking.status === 'PENDING' && 'Awaiting confirmation...'}
                          {booking.status === 'COMPLETED' && 'Trip completed'}
                          {booking.status === 'CANCELLED' && 'Booking cancelled'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
