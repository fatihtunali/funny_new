'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaPlus, FaTimes } from 'react-icons/fa';

interface QuickTour {
  title: string;
  duration: string;
  port: string;
  pickupType: string;
  price2pax: string;
  price4pax: string;
  price6pax: string;
}

export default function QuickAddPage() {
  const router = useRouter();
  const [tours, setTours] = useState<QuickTour[]>([
    { title: '', duration: '8 Hours', port: 'Istanbul', pickupType: 'both', price2pax: '', price4pax: '', price6pax: '' }
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addTour = () => {
    setTours([...tours, { title: '', duration: '8 Hours', port: 'Istanbul', pickupType: 'both', price2pax: '', price4pax: '', price6pax: '' }]);
  };

  const removeTour = (index: number) => {
    setTours(tours.filter((_, i) => i !== index));
  };

  const updateTour = (index: number, field: keyof QuickTour, value: string) => {
    const newTours = [...tours];
    newTours[index][field] = value;
    setTours(newTours);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      // Get next available package ID
      const nextIdRes = await fetch('/api/admin/next-package-id');
      const nextIdData = await nextIdRes.json();
      let currentId = parseInt(nextIdData.nextId);

      for (const tour of tours) {
        if (!tour.title || !tour.price2pax) continue; // Skip empty tours

        const packageData = {
          packageId: String(currentId).padStart(2, '0'),
          packageType: 'SHORE_EXCURSION',
          title: tour.title,
          slug: tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          duration: tour.duration,
          description: `${tour.title} - ${tour.duration} shore excursion from ${tour.port}`,
          destinations: tour.port,
          port: tour.port,
          pickupType: tour.pickupType,
          image: tour.port === 'Istanbul' ? '/images/BlueMosqueIstanbul.jpg' :
                 tour.port === 'Kusadasi' ? '/images/Ephesus_Library.jpg' :
                 tour.port === 'Izmir' ? '/images/Ephesus_Library.jpg' :
                 tour.port === 'Cappadocia' ? '/images/cappadociaballoonride.jpg' :
                 '/images/hotelwithpackage.jpg',
          pdfUrl: '',
          isActive: true,
          highlights: JSON.stringify([
            `Professional English-speaking guide`,
            `${tour.pickupType === 'port' ? 'Port' : tour.pickupType === 'hotel' ? 'Hotel' : 'Port and hotel'} pickup`,
            `Back-to-ship guarantee`,
            `${tour.duration} tour duration`
          ]),
          included: JSON.stringify([
            'Professional guide',
            'Transportation',
            'Entrance fees'
          ]),
          notIncluded: JSON.stringify([
            'Lunch',
            'Personal expenses',
            'Tips and gratuities'
          ]),
          itinerary: JSON.stringify([
            {
              day: 1,
              title: tour.title,
              description: `Full day ${tour.title}`,
              meals: '-'
            }
          ]),
          pricing: JSON.stringify({
            perPerson: {
              '1pax': parseInt(tour.price2pax) * 2 || 0, // Estimate
              '2pax': parseInt(tour.price2pax) || 0,
              '3pax': Math.round((parseInt(tour.price2pax) + parseInt(tour.price4pax || tour.price2pax)) / 2) || 0,
              '4pax': parseInt(tour.price4pax || tour.price2pax) || 0,
              '5pax': Math.round((parseInt(tour.price4pax || tour.price2pax) + parseInt(tour.price6pax || tour.price4pax || tour.price2pax)) / 2) || 0,
              '6pax': parseInt(tour.price6pax || tour.price4pax || tour.price2pax) || 0,
              '7to9pax': parseInt(tour.price6pax || tour.price4pax || tour.price2pax) || 0,
              '10to15pax': parseInt(tour.price6pax || tour.price4pax || tour.price2pax) || 0
            },
            children: {
              age0to2: 0,
              age3to6: Math.round(parseInt(tour.price6pax || tour.price4pax || tour.price2pax) * 0.5) || 0,
              age7to12: Math.round(parseInt(tour.price6pax || tour.price4pax || tour.price2pax) * 0.7) || 0
            }
          }),
          hotels: JSON.stringify({})
        };

        const res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packageData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(`Failed to save "${tour.title}": ${data.error || 'Unknown error'}`);
        }

        currentId++;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save packages');
      setSaving(false);
    }
  };

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
                height={40}
                className="mr-6"
              />
              <h1 className="text-2xl font-bold text-gray-900">Quick Add Shore Excursions</h1>
            </div>
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="inline mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Add Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enter tour name and basic pricing (2 pax, 4 pax, 6 pax rates)</li>
            <li>• Missing prices will be auto-calculated based on available data</li>
            <li>• Click "+ Add Another Tour" to batch add multiple tours</li>
            <li>• Empty tours (without title or price) will be skipped</li>
          </ul>
        </div>

        <div className="space-y-4">
          {tours.map((tour, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tour #{index + 1}</h3>
                {tours.length > 1 && (
                  <button
                    onClick={() => removeTour(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="inline mr-1" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Name *</label>
                  <input
                    type="text"
                    value={tour.title}
                    onChange={(e) => updateTour(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g., Imperial Tour, Bosphorus Cruise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <select
                    value={tour.duration}
                    onChange={(e) => updateTour(index, 'duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="4 Hours">4 Hours</option>
                    <option value="6 Hours">6 Hours</option>
                    <option value="8 Hours">8 Hours</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Port</label>
                  <select
                    value={tour.port}
                    onChange={(e) => updateTour(index, 'port', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Istanbul">Istanbul</option>
                    <option value="Kusadasi">Kusadasi</option>
                    <option value="Izmir">Izmir</option>
                    <option value="Bodrum">Bodrum</option>
                    <option value="Antalya">Antalya</option>
                    <option value="Marmaris">Marmaris</option>
                    <option value="Cappadocia">Cappadocia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Type</label>
                  <select
                    value={tour.pickupType}
                    onChange={(e) => updateTour(index, 'pickupType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="both">Port & Hotel</option>
                    <option value="port">Port Only</option>
                    <option value="hotel">Hotel Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price - 2 Pax (€) *</label>
                  <input
                    type="number"
                    value={tour.price2pax}
                    onChange={(e) => updateTour(index, 'price2pax', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price - 4 Pax (€)</label>
                  <input
                    type="number"
                    value={tour.price4pax}
                    onChange={(e) => updateTour(index, 'price4pax', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="130"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - will use 2 pax price if empty</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price - 6+ Pax (€)</label>
                  <input
                    type="number"
                    value={tour.price6pax}
                    onChange={(e) => updateTour(index, 'price6pax', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="110"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional - will use 4 pax price if empty</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={addTour}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Another Tour
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center text-lg font-semibold"
          >
            <FaSave className="mr-2" />
            {saving ? 'Saving...' : `Save ${tours.filter(t => t.title && t.price2pax).length} Tour${tours.filter(t => t.title && t.price2pax).length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
