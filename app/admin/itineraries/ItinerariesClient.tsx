'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

interface Itinerary {
  uuid: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  city_nights: Array<{ city: string; nights: number }>;
  start_date: string;
  adults: number;
  children: number;
  hotel_category: string;
  tour_type: string;
  total_price?: number;
  price_per_person?: number;
  created_at: string;
  status?: string;
  booking_requested_at?: string;
  source?: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  online: number;
  manual: number;
}

export default function ItinerariesClient() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, online: 0, manual: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    fetchItineraries();
  }, [statusFilter, sourceFilter]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (sourceFilter !== 'all') params.set('source', sourceFilter);

      const response = await fetch(`/api/admin/itineraries?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch itineraries');
      }

      setItineraries(data.itineraries || []);
      setStats(data.stats || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, online: 0, manual: 0 });

      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load itineraries');
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading itineraries from TQA...</p>
      </div>
    );
  }

  if (error && itineraries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">TQA Admin Integration Needed</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            To view itineraries here, TQA needs to add an admin endpoint that returns all itineraries for organization ID 5.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-blue-900 mb-2">Alternative Options:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Contact TQA to add the admin itineraries endpoint</li>
              <li>• Access TQA&apos;s admin panel directly at <a href="https://travelquoteai.com/admin" target="_blank" className="underline">travelquoteai.com/admin</a></li>
              <li>• Implement local storage of itineraries in your database</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back to Dashboard */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="text-sm" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Customer Itineraries</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-emerald-100 rounded-full p-2">
              <FaMapMarkerAlt className="text-xl text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-2">
              <FaCalendar className="text-xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed || 0}</p>
            </div>
            <div className="bg-green-100 rounded-full p-2">
              <FaCalendar className="text-xl text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Online</p>
              <p className="text-2xl font-bold text-blue-600">{stats.online}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-2">
              <FaEnvelope className="text-xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Manual</p>
              <p className="text-2xl font-bold text-purple-600">{stats.manual}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-2">
              <FaEnvelope className="text-xl text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Itineraries Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Itineraries</h2>
            <button
              onClick={fetchItineraries}
              className="btn-secondary text-sm"
            >
              Refresh
            </button>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="online">Online</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {itineraries.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <FaMapMarkerAlt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No itineraries generated yet</p>
              <p className="text-sm">When customers use the Smart Trip Planner, their itineraries will appear here.</p>
              <Link
                href="/smart-trip-planner"
                target="_blank"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                View Smart Trip Planner →
              </Link>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travel Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itineraries.map((itinerary) => {
                  const totalNights = itinerary.city_nights.reduce((sum, cn) => sum + cn.nights, 0);
                  const cities = itinerary.city_nights.map(cn => cn.city).join(', ');

                  return (
                    <tr key={itinerary.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{itinerary.customer_name}</div>
                          <div className="text-gray-500 flex items-center gap-1 mt-1">
                            <FaEnvelope className="text-xs" />
                            {itinerary.customer_email}
                          </div>
                          {itinerary.customer_phone && (
                            <div className="text-gray-500 flex items-center gap-1 mt-1">
                              <FaPhone className="text-xs" />
                              {itinerary.customer_phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{cities}</div>
                        <div className="text-xs text-gray-500">
                          {totalNights + 1} days / {totalNights} nights
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1 mb-1">
                          <FaCalendar className="text-xs" />
                          {new Date(itinerary.start_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          {itinerary.adults} Adult{itinerary.adults > 1 ? 's' : ''}
                          {itinerary.children > 0 && `, ${itinerary.children} Child${itinerary.children > 1 ? 'ren' : ''}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {itinerary.hotel_category}-Star • {itinerary.tour_type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {itinerary.total_price ? (
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                              €{itinerary.total_price.toLocaleString()}
                            </div>
                            {itinerary.price_per_person && (
                              <div className="text-xs text-gray-500">
                                €{itinerary.price_per_person.toLocaleString()}/person
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {itinerary.booking_requested_at ? (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Booking Requested
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(itinerary.booking_requested_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Not Requested
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(itinerary.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/itinerary/${itinerary.uuid}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Itinerary"
                          >
                            <FaEye className="inline" />
                          </Link>
                          <a
                            href={`mailto:${itinerary.customer_email}?subject=Your Turkey Itinerary - ${cities}&body=Dear ${itinerary.customer_name},%0D%0A%0D%0AThank you for using our Smart Trip Planner!%0D%0A%0D%0AView your itinerary: ${window.location.origin}/itinerary/${itinerary.uuid}`}
                            className="text-green-600 hover:text-green-900"
                            title="Send Email"
                          >
                            <FaEnvelope className="inline" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
