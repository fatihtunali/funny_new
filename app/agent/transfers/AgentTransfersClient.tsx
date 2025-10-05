'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TransferLocation {
  id: string;
  name: string;
  code: string | null;
  type: string;
  region: string;
}

interface Transfer {
  id: string;
  fromLocation: TransferLocation;
  toLocation: TransferLocation;
  sicPricePerPerson: number | null;
  price1to2Pax: number | null;
  price3to5Pax: number | null;
  price6to10Pax: number | null;
  onRequestOnly: boolean;
  vehicleType1to2: string | null;
  vehicleType3to5: string | null;
  vehicleType6to10: string | null;
  distance: string | null;
  duration: string | null;
}

export default function AgentTransfersClient() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch('/api/transfers');
      if (!res.ok) throw new Error('Failed to fetch transfers');
      const data = await res.json();
      setTransfers(data.transfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transfer.fromLocation.name.toLowerCase().includes(searchLower) ||
      transfer.toLocation.name.toLowerCase().includes(searchLower) ||
      transfer.fromLocation.region.toLowerCase().includes(searchLower) ||
      transfer.toLocation.region.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transfers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transfer Services</h1>
              <p className="text-sm text-gray-600">Browse available transfer routes for your customers</p>
            </div>
            <Link
              href="/agent/dashboard"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by location, city, or airport code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Transfers List */}
        <div className="space-y-4">
          {filteredTransfers.map((transfer) => (
            <div key={transfer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Route */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-600">{transfer.fromLocation.type}</p>
                      <p className="text-lg font-semibold text-gray-900">{transfer.fromLocation.name}</p>
                      <p className="text-xs text-gray-500">{transfer.fromLocation.region}</p>
                    </div>
                    <div className="text-purple-600 text-2xl">→</div>
                    <div className="text-center flex-1">
                      <p className="text-sm text-gray-600">{transfer.toLocation.type}</p>
                      <p className="text-lg font-semibold text-gray-900">{transfer.toLocation.name}</p>
                      <p className="text-xs text-gray-500">{transfer.toLocation.region}</p>
                    </div>
                  </div>

                  {/* Details */}
                  {(transfer.distance || transfer.duration) && (
                    <div className="flex gap-4 mb-4 text-sm text-gray-600">
                      {transfer.distance && <span>📏 {transfer.distance}</span>}
                      {transfer.duration && <span>⏱️ {transfer.duration}</span>}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900 mb-2">B2B Pricing (EUR):</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {transfer.sicPricePerPerson && (
                        <div>
                          <p className="text-gray-600">SIC (per person)</p>
                          <p className="font-semibold text-gray-900">€{transfer.sicPricePerPerson}</p>
                        </div>
                      )}
                      {transfer.price1to2Pax && (
                        <div>
                          <p className="text-gray-600">1-2 Pax</p>
                          <p className="font-semibold text-gray-900">€{transfer.price1to2Pax}</p>
                          <p className="text-xs text-gray-500">{transfer.vehicleType1to2}</p>
                        </div>
                      )}
                      {transfer.price3to5Pax && (
                        <div>
                          <p className="text-gray-600">3-5 Pax</p>
                          <p className="font-semibold text-gray-900">€{transfer.price3to5Pax}</p>
                          <p className="text-xs text-gray-500">{transfer.vehicleType3to5}</p>
                        </div>
                      )}
                      {transfer.price6to10Pax && (
                        <div>
                          <p className="text-gray-600">6-10 Pax</p>
                          <p className="font-semibold text-gray-900">€{transfer.price6to10Pax}</p>
                          <p className="text-xs text-gray-500">{transfer.vehicleType6to10}</p>
                        </div>
                      )}
                      {transfer.onRequestOnly && (
                        <div>
                          <p className="text-gray-600">10+ Pax</p>
                          <p className="font-semibold text-orange-600">On Request</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => alert('Contact admin to book transfers')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransfers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transfers found</p>
          </div>
        )}
      </main>
    </div>
  );
}
