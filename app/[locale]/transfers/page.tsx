'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FaCar, FaPlane, FaUsers, FaCalendarAlt, FaClock, FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';
import TransferBookingModal from '@/components/TransferBookingModal';

interface Location {
  id: string;
  name: string;
  code?: string;
  type: string;
  region: string;
}

interface Transfer {
  id: string;
  fromLocation: Location;
  toLocation: Location;
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
  const t = useTranslations('transfersPage');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [, setLoading] = useState(true);

  // Search form state
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [selectedFromId, setSelectedFromId] = useState('');
  const [selectedToId, setSelectedToId] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [passengers, setPassengers] = useState(2);
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('09:00');

  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<{price: number, vehicleType: string} | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch('/api/transfers');
      const data = await res.json();
      setTransfers(data.transfers || []);
      setLocations(data.locations || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFromLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
    loc.code?.toLowerCase().includes(searchFrom.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchFrom.toLowerCase())
  ).slice(0, 10);

  const filteredToLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTo.toLowerCase()) ||
    loc.code?.toLowerCase().includes(searchTo.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchTo.toLowerCase())
  ).slice(0, 10);

  const selectedFromLocation = locations.find(l => l.id === selectedFromId);
  const selectedToLocation = locations.find(l => l.id === selectedToId);

  // Calculate price when route and passengers change
  useEffect(() => {
    if (selectedFromId && selectedToId) {
      // Support bidirectional route matching
      let transfer = transfers.find(
        t => t.fromLocation.id === selectedFromId && t.toLocation.id === selectedToId
      );

      // If not found, check reverse direction
      const reverseTransfer = transfers.find(
        t => t.fromLocation.id === selectedToId && t.toLocation.id === selectedFromId
      );

      // Use reverse transfer if found, but normalize it to user's selected direction
      if (!transfer && reverseTransfer) {
        transfer = {
          ...reverseTransfer,
          fromLocation: reverseTransfer.toLocation,
          toLocation: reverseTransfer.fromLocation,
        };
      }

      if (transfer) {
        setSelectedTransfer(transfer);

        if (transfer.onRequestOnly || passengers > 10) {
          setCalculatedPrice(null);
        } else if (passengers >= 6 && transfer.price6to10Pax) {
          setCalculatedPrice({
            price: transfer.price6to10Pax,
            vehicleType: transfer.vehicleType6to10 || 'Minibus (Sprinter)'
          });
        } else if (passengers >= 3 && transfer.price3to5Pax) {
          setCalculatedPrice({
            price: transfer.price3to5Pax,
            vehicleType: transfer.vehicleType3to5 || 'Minivan (Transporter)'
          });
        } else if (transfer.price1to2Pax) {
          setCalculatedPrice({
            price: transfer.price1to2Pax,
            vehicleType: transfer.vehicleType1to2 || 'Sedan'
          });
        }
      } else {
        setSelectedTransfer(null);
        setCalculatedPrice(null);
      }
    }
  }, [selectedFromId, selectedToId, passengers, transfers]);

  const handleBookNow = () => {
    if (!selectedTransfer || !calculatedPrice || !transferDate) {
      alert('Please select a transfer route, date, and ensure pricing is available');
      return;
    }

    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('searchTransfer')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* From Location Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                {t('fromLocation')}
              </label>
              <input
                type="text"
                placeholder={t('locationPlaceholder')}
                value={selectedFromLocation ? selectedFromLocation.name : searchFrom}
                onChange={(e) => {
                  setSearchFrom(e.target.value);
                  setSelectedFromId('');
                  setShowFromDropdown(true);
                }}
                onFocus={() => setShowFromDropdown(true)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showFromDropdown && searchFrom && !selectedFromId && filteredFromLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredFromLocations.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setSelectedFromId(loc.id);
                        setSearchFrom(loc.name);
                        setShowFromDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{loc.name}</div>
                      <div className="text-sm text-gray-500">
                        {loc.type} • {loc.region}
                        {loc.code && ` • ${loc.code}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To Location Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                {t('toLocation')}
              </label>
              <input
                type="text"
                placeholder={t('locationPlaceholder')}
                value={selectedToLocation ? selectedToLocation.name : searchTo}
                onChange={(e) => {
                  setSearchTo(e.target.value);
                  setSelectedToId('');
                  setShowToDropdown(true);
                }}
                onFocus={() => setShowToDropdown(true)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showToDropdown && searchTo && !selectedToId && filteredToLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredToLocations.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setSelectedToId(loc.id);
                        setSearchTo(loc.name);
                        setShowToDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{loc.name}</div>
                      <div className="text-sm text-gray-500">
                        {loc.type} • {loc.region}
                        {loc.code && ` • ${loc.code}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-2 text-blue-600" />
                {t('numberOfPassengers')}
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? t('passenger') : t('passengers')}</option>
                ))}
                <option value={11}>{t('passengersCount', { count: '10+' })}</option>
              </select>
            </div>

            {/* Transfer Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-blue-600" />
                {t('transferDate')}
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Transfer Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-blue-600" />
                {t('transferTime')}
              </label>
              <input
                type="time"
                value={transferTime}
                onChange={(e) => setTransferTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Display & Booking */}
          {selectedTransfer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    {selectedFromLocation?.name} → {selectedToLocation?.name}
                  </div>
                  {calculatedPrice ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <FaEuroSign className="text-blue-600" />
                        <span className="text-3xl font-bold text-gray-900">
                          {t('priceDisplay', { price: calculatedPrice.price })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaCar />
                        <span>{calculatedPrice.vehicleType}</span>
                        {selectedTransfer.duration && (
                          <>
                            <span className="mx-2">•</span>
                            <FaClock />
                            <span>{selectedTransfer.duration}</span>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedTransfer.onRequestOnly || passengers > 10 ?
                        t('priceOnRequest') :
                        t('noPricing')}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBookNow}
                  disabled={!calculatedPrice || !transferDate}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {t('bookNow')}
                </button>
              </div>
            </motion.div>
          )}

          {selectedFromId && selectedToId && !selectedTransfer && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              {t('noRoute')}
            </div>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlane className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.airports')}</h3>
            <p className="text-gray-600">{t('features.airportsDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCar className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.modernFleet')}</h3>
            <p className="text-gray-600">{t('features.modernFleetDesc')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEuroSign className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('features.fixedPricing')}</h3>
            <p className="text-gray-600">{t('features.fixedPricingDesc')}</p>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && selectedTransfer && calculatedPrice && (
        <TransferBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          transferData={{
            transferId: selectedTransfer.id,
            fromLocation: selectedFromLocation!.name,
            toLocation: selectedToLocation!.name,
            date: transferDate,
            time: transferTime,
            passengers: passengers,
            price: calculatedPrice.price,
            vehicleType: calculatedPrice.vehicleType,
          }}
        />
      )}
    </div>
  );
}
