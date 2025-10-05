'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaPlane, FaUsers, FaCalendarAlt, FaClock, FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';

interface Transfer {
  id: string;
  region: string;
  fromLocation: string;
  toLocation: string;
  sicPricePerPerson: number | null;
  price1to2Pax: number | null;
  price3to5Pax: number | null;
  price6to10Pax: number | null;
  onRequestOnly: boolean;
  vehicleType1to2: string | null;
  vehicleType3to5: string | null;
  vehicleType6to10: string | null;
  duration: string | null;
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('09:00');

  // Filtered options
  const [fromLocations, setFromLocations] = useState<string[]>([]);
  const [toLocations, setToLocations] = useState<string[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<{price: number, vehicleType: string} | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch('/api/transfers');
      const data = await res.json();
      setTransfers(data.transfers || []);
      setRegions(data.regions || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update from locations when region changes
  useEffect(() => {
    if (selectedRegion) {
      const regionTransfers = transfers.filter(t => t.region === selectedRegion);
      const uniqueFrom = Array.from(new Set(regionTransfers.map(t => t.fromLocation)));
      setFromLocations(uniqueFrom);
      setSelectedFrom('');
      setSelectedTo('');
    } else {
      setFromLocations([]);
      setToLocations([]);
    }
  }, [selectedRegion, transfers]);

  // Update to locations when from location changes
  useEffect(() => {
    if (selectedFrom && selectedRegion) {
      const matchingTransfers = transfers.filter(
        t => t.region === selectedRegion && t.fromLocation === selectedFrom
      );
      const uniqueTo = Array.from(new Set(matchingTransfers.map(t => t.toLocation)));
      setToLocations(uniqueTo);
      setSelectedTo('');
    } else {
      setToLocations([]);
    }
  }, [selectedFrom, selectedRegion, transfers]);

  // Calculate price when route and passengers change
  useEffect(() => {
    if (selectedRegion && selectedFrom && selectedTo) {
      const transfer = transfers.find(
        t => t.region === selectedRegion &&
             t.fromLocation === selectedFrom &&
             t.toLocation === selectedTo
      );

      if (transfer) {
        setSelectedTransfer(transfer);

        if (transfer.onRequestOnly && passengers >= 10) {
          setCalculatedPrice(null);
        } else if (passengers >= 6 && transfer.price6to10Pax) {
          setCalculatedPrice({
            price: transfer.price6to10Pax,
            vehicleType: transfer.vehicleType6to10 || 'Minibus'
          });
        } else if (passengers >= 3 && transfer.price3to5Pax) {
          setCalculatedPrice({
            price: transfer.price3to5Pax,
            vehicleType: transfer.vehicleType3to5 || 'Minivan'
          });
        } else if (transfer.price1to2Pax) {
          setCalculatedPrice({
            price: transfer.price1to2Pax,
            vehicleType: transfer.vehicleType1to2 || 'Sedan'
          });
        } else {
          setCalculatedPrice(null);
        }
      }
    } else {
      setSelectedTransfer(null);
      setCalculatedPrice(null);
    }
  }, [selectedRegion, selectedFrom, selectedTo, passengers, transfers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FaCar className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Airport Transfers in Turkey</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Reliable, comfortable, and affordable airport transfers across Turkey. Book your ride in advance and travel with peace of mind.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Transfer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select region</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPlane className="inline mr-2 text-primary-600" />
                From
              </label>
              <select
                value={selectedFrom}
                onChange={(e) => setSelectedFrom(e.target.value)}
                disabled={!selectedRegion}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select pickup location</option>
                {fromLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                To
              </label>
              <select
                value={selectedTo}
                onChange={(e) => setSelectedTo(e.target.value)}
                disabled={!selectedFrom}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select destination</option>
                {toLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-2 text-primary-600" />
                Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                ))}
                <option value={11}>10+ passengers</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-primary-600" />
                Date
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-primary-600" />
                Time
              </label>
              <input
                type="time"
                value={transferTime}
                onChange={(e) => setTransferTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Display */}
          {selectedTransfer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t pt-6"
            >
              {calculatedPrice ? (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Transfer</h3>
                      <p className="text-gray-600 text-sm">
                        {selectedFrom} → {selectedTo}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Vehicle: {calculatedPrice.vehicleType} • {passengers} passenger{passengers !== 1 ? 's' : ''}
                        {selectedTransfer.duration && <span> • {selectedTransfer.duration}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-3xl font-bold text-primary-700">
                        <FaEuroSign className="text-2xl" />
                        {calculatedPrice.price}
                      </div>
                      <p className="text-sm text-gray-600">per vehicle, one way</p>
                      <p className="text-xs text-gray-500 mt-1">All taxes included</p>
                    </div>
                  </div>
                  <button
                    disabled={!transferDate}
                    className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {transferDate ? 'Book Now' : 'Please select a date'}
                  </button>
                </div>
              ) : selectedTransfer.onRequestOnly && passengers >= 10 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-2">On Request</p>
                  <p className="text-gray-600">For 10+ passengers, please contact us for a custom quote.</p>
                  <a href="/contact" className="inline-block mt-4 btn-primary">
                    Contact Us
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">Price not available for this route configuration.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our Transfers?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCar className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Modern Vehicles</h3>
            <p className="text-gray-600">A/C Deluxe Mercedes Sprinter or same category vehicles</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Drivers</h3>
            <p className="text-gray-600">Experienced, licensed, and English-speaking drivers</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEuroSign className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
            <p className="text-gray-600">All taxes, tolls, and parking fees included in price</p>
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Information</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>All rates are in EUR per vehicle, one way, and inclusive of local taxes</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Rates are valid for Summer 2025 period (01/04/2025 – 01/10/2025)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>1-5 pax will be operated with minivan (Mercedes Vito or Transporter)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>6-10 pax will be operated with minibus (Volkswagen Volt or Mercedes Sprinter)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Flight tracking available - your driver will adjust pickup time based on actual arrival</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Meet & greet service included - driver will wait at arrivals with name sign</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
