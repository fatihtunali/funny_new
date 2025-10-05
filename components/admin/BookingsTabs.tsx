'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaCalendar, FaHotel, FaUsers, FaCar, FaMapMarkerAlt } from 'react-icons/fa';

interface PackageBooking {
  id: string;
  referenceNumber: string;
  packageName: string;
  travelDate: Date;
  duration: string;
  hotelCategory: string;
  adults: number;
  children3to5: number;
  children6to10: number;
  totalPrice: number;
  currency: string;
  status: string;
  createdAt: Date;
  userId?: string;
  agentId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  agent?: {
    companyName: string;
    email: string;
  };
  commissionAmount?: number;
  commissionRate?: number;
}

interface TransferBooking {
  id: string;
  referenceNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  transferDate: Date;
  transferTime: string;
  numberOfPassengers: number;
  flightNumber?: string;
  totalPrice: number;
  currency: string;
  vehicleType: string;
  status: string;
  createdAt: Date;
  transfer: {
    fromLocation: {
      name: string;
    };
    toLocation: {
      name: string;
    };
  };
}

interface DailyTourBooking {
  id: string;
  referenceNumber: string;
  guestName?: string;
  guestEmail: string;
  guestPhone: string;
  tourDate: Date;
  numberOfPax: number;
  totalPrice: number;
  currency: string;
  status: string;
  createdAt: Date;
  tour: {
    title: string;
    tourCode: string;
  };
}

interface BookingsTabsProps {
  packageBookings: PackageBooking[];
  transferBookings: TransferBooking[];
  dailyTourBookings: DailyTourBooking[];
}

type TabType = 'packages' | 'transfers' | 'dailyTours';

export default function BookingsTabs({ packageBookings, transferBookings, dailyTourBookings }: BookingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('packages');

  const tabClass = (tab: TabType) =>
    `px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
    }`;

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Package Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{packageBookings.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FaHotel className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transfer Bookings</p>
              <p className="text-3xl font-bold text-purple-600">{transferBookings.length}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <FaCar className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Tour Bookings</p>
              <p className="text-3xl font-bold text-teal-600">{dailyTourBookings.length}</p>
            </div>
            <div className="bg-teal-100 rounded-full p-3">
              <FaCalendar className="text-2xl text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('packages')} className={tabClass('packages')}>
              Package Tours ({packageBookings.length})
            </button>
            <button onClick={() => setActiveTab('transfers')} className={tabClass('transfers')}>
              Transfers ({transferBookings.length})
            </button>
            <button onClick={() => setActiveTab('dailyTours')} className={tabClass('dailyTours')}>
              Daily Tours ({dailyTourBookings.length})
            </button>
          </nav>
        </div>

        {/* Package Bookings Tab */}
        {activeTab === 'packages' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travel Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packageBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No package bookings found.
                    </td>
                  </tr>
                ) : (
                  packageBookings.map((booking) => {
                    const customerName = booking.user?.name || booking.guestName || 'N/A';
                    const customerEmail = booking.user?.email || booking.guestEmail || 'N/A';

                    return (
                      <tr key={booking.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-800">
                            {booking.referenceNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">{customerName}</div>
                              <div className="text-xs text-gray-500">{customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{booking.packageName}</div>
                          <div className="text-xs text-gray-500">{booking.hotelCategory}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <FaUsers className="inline mr-1" />
                          {booking.adults + booking.children3to5 + booking.children6to10}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          €{booking.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Transfer Bookings Tab */}
        {activeTab === 'transfers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passengers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transferBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No transfer bookings found.
                    </td>
                  </tr>
                ) : (
                  transferBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                        {booking.referenceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{booking.guestName}</div>
                            <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                            <div className="text-xs text-gray-500">{booking.guestPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-purple-500 mr-2" />
                          <div>
                            <div className="font-medium">{booking.transfer.fromLocation.name}</div>
                            <div className="text-xs text-gray-500">→ {booking.transfer.toLocation.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{new Date(booking.transferDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{booking.transferTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <FaUsers className="inline mr-1" />
                        {booking.numberOfPassengers}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <FaCar className="inline mr-1" />
                        {booking.vehicleType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        €{booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Daily Tour Bookings Tab */}
        {activeTab === 'dailyTours' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyTourBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No daily tour bookings found.
                    </td>
                  </tr>
                ) : (
                  dailyTourBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-teal-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">
                        {booking.referenceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{booking.guestName || 'Guest'}</div>
                            <div className="text-xs text-gray-500">{booking.guestEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium">{booking.tour.title}</div>
                        <div className="text-xs text-gray-500">{booking.tour.tourCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(booking.tourDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <FaUsers className="inline mr-1" />
                        {booking.numberOfPax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        €{booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
