'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface DailyTour {
  id: string;
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
  category: string;
  sicPrice: number;
  privateMin2: number;
  privateMin4: number;
  privateMin6: number;
  privateMin8: number;
  privateMin10: number;
  included?: string;
  notIncluded?: string;
  notes?: string;
  port?: string;
  pickupLocations?: string;
  image?: string;
  pdfUrl?: string;
  isActive: boolean;
}

export default function EditDailyTourPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tour, setTour] = useState<DailyTour | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/admin/daily-tours/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTour(data.tour);
        } else {
          alert('Failed to load tour');
          router.push('/admin/daily-tours');
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        alert('Error loading tour');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, router]);

  const handleSave = async () => {
    if (!tour) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/daily-tours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour),
      });

      const data = await res.json();

      if (data.success) {
        alert('Tour updated successfully!');
        router.push('/admin/daily-tours');
      } else {
        alert('Failed to update tour: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving tour');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof DailyTour, value: string | number | boolean) => {
    if (!tour) return;
    setTour({ ...tour, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-gray-600">Tour not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/daily-tours"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Daily Tours
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Edit Daily Tour</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-primary flex items-center ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tour Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Code
              </label>
              <input
                type="text"
                value={tour.tourCode}
                onChange={(e) => updateField('tourCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={tour.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={tour.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={tour.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={tour.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="DAILY_TOUR">Daily City Tour</option>
                <option value="SHORE_EXCURSION">Shore Excursion</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={tour.isActive ? 'active' : 'inactive'}
                onChange={(e) => updateField('isActive', e.target.value === 'active')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIC Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.sicPrice}
                onChange={(e) => updateField('sicPrice', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Min 2 Pax (€/person)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.privateMin2}
                onChange={(e) => updateField('privateMin2', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Min 4 Pax (€/person)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.privateMin4}
                onChange={(e) => updateField('privateMin4', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Min 6 Pax (€/person)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.privateMin6}
                onChange={(e) => updateField('privateMin6', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Min 8 Pax (€/person)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.privateMin8}
                onChange={(e) => updateField('privateMin8', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Min 10 Pax (€/person)
              </label>
              <input
                type="number"
                step="0.01"
                value={tour.privateMin10}
                onChange={(e) => updateField('privateMin10', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={tour.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Included */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Included
              </label>
              <textarea
                value={tour.included || ''}
                onChange={(e) => updateField('included', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Not Included */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Not Included
              </label>
              <textarea
                value={tour.notIncluded || ''}
                onChange={(e) => updateField('notIncluded', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={tour.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Port (for shore excursions) */}
            {tour.category === 'SHORE_EXCURSION' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="text"
                  value={tour.port || ''}
                  onChange={(e) => updateField('port', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Pickup Locations */}
            <div className={tour.category === 'SHORE_EXCURSION' ? '' : 'md:col-span-2'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Locations
              </label>
              <input
                type="text"
                value={tour.pickupLocations || ''}
                onChange={(e) => updateField('pickupLocations', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
