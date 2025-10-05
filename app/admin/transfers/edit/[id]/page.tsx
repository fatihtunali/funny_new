'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  code?: string;
  type: string;
  region: string;
  city?: string;
}

export default function EditTransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  const [formData, setFormData] = useState({
    fromLocationId: '',
    toLocationId: '',
    sicPricePerPerson: '',
    price1to2Pax: '',
    price3to5Pax: '',
    price6to10Pax: '',
    onRequestOnly: false,
    vehicleType1to2: 'Sedan',
    vehicleType3to5: 'Minivan (Transporter)',
    vehicleType6to10: 'Minibus (Sprinter)',
    distance: '',
    duration: '',
    isActive: true,
  });

  useEffect(() => {
    fetchLocations();
    fetchTransfer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/locations');
      const data = await res.json();
      setLocations(data.locations || []);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const fetchTransfer = async () => {
    try {
      const res = await fetch(`/api/admin/transfers/${id}`);
      const data = await res.json();

      if (data.transfer) {
        const t = data.transfer;
        setFormData({
          fromLocationId: t.fromLocationId || '',
          toLocationId: t.toLocationId || '',
          sicPricePerPerson: t.sicPricePerPerson?.toString() || '',
          price1to2Pax: t.price1to2Pax?.toString() || '',
          price3to5Pax: t.price3to5Pax?.toString() || '',
          price6to10Pax: t.price6to10Pax?.toString() || '',
          onRequestOnly: t.onRequestOnly || false,
          vehicleType1to2: t.vehicleType1to2 || 'Sedan',
          vehicleType3to5: t.vehicleType3to5 || 'Minivan (Transporter)',
          vehicleType6to10: t.vehicleType6to10 || 'Minibus (Sprinter)',
          distance: t.distance || '',
          duration: t.duration || '',
          isActive: t.isActive !== undefined ? t.isActive : true,
        });
      }
    } catch (error) {
      console.error('Failed to load transfer:', error);
      setError('Failed to load transfer');
    } finally {
      setLoading(false);
    }
  };

  const filteredFromLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchFrom.toLowerCase()) ||
    loc.code?.toLowerCase().includes(searchFrom.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTo.toLowerCase()) ||
    loc.code?.toLowerCase().includes(searchTo.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchTo.toLowerCase())
  );

  const selectedFromLocation = locations.find(l => l.id === formData.fromLocationId);
  const selectedToLocation = locations.find(l => l.id === formData.toLocationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/transfers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Transfer updated successfully!');
        setTimeout(() => router.push('/admin/transfers'), 1500);
      } else {
        setError(data.error || 'Failed to update transfer');
      }
    } catch (error) {
      console.error('Failed to update transfer:', error);
      setError('Failed to update transfer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transfer route? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/transfers/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/transfers');
      } else {
        setError(data.error || 'Failed to delete transfer');
      }
    } catch (error) {
      console.error('Failed to delete transfer:', error);
      setError('Failed to delete transfer');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/transfers"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Transfers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Transfer Route</h1>
          <p className="text-gray-600 mt-2">Update pricing and details for this route</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Location Selection */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location *
                </label>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <select
                  required
                  value={formData.fromLocationId}
                  onChange={(e) => setFormData({ ...formData, fromLocationId: e.target.value })}
                  size={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select From Location</option>
                  {filteredFromLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.type}) - {loc.region}
                    </option>
                  ))}
                </select>
                {selectedFromLocation && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-medium">{selectedFromLocation.name}</span> ({selectedFromLocation.type})
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Location *
                </label>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <select
                  required
                  value={formData.toLocationId}
                  onChange={(e) => setFormData({ ...formData, toLocationId: e.target.value })}
                  size={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select To Location</option>
                  {filteredToLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.type}) - {loc.region}
                    </option>
                  ))}
                </select>
                {selectedToLocation && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-medium">{selectedToLocation.name}</span> ({selectedToLocation.type})
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (Optional)
                </label>
                <input
                  type="text"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="e.g., 45 km"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 45-60 min"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.onRequestOnly}
                      onChange={(e) => setFormData({ ...formData, onRequestOnly: e.target.checked })}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Request Only (10+ passengers)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing (EUR)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SIC Price Per Person
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sicPricePerPerson}
                  onChange={(e) => setFormData({ ...formData, sicPricePerPerson: e.target.value })}
                  placeholder="e.g., 25.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Shared transfer price per person</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1-2 Passengers (Private)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price1to2Pax}
                  onChange={(e) => setFormData({ ...formData, price1to2Pax: e.target.value })}
                  placeholder="e.g., 120.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3-5 Passengers (Private)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price3to5Pax}
                  onChange={(e) => setFormData({ ...formData, price3to5Pax: e.target.value })}
                  placeholder="e.g., 120.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-10 Passengers (Private)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price6to10Pax}
                  onChange={(e) => setFormData({ ...formData, price6to10Pax: e.target.value })}
                  placeholder="e.g., 140.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1-2 Pax Vehicle
                </label>
                <input
                  type="text"
                  value={formData.vehicleType1to2}
                  onChange={(e) => setFormData({ ...formData, vehicleType1to2: e.target.value })}
                  placeholder="e.g., Sedan"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3-5 Pax Vehicle
                </label>
                <input
                  type="text"
                  value={formData.vehicleType3to5}
                  onChange={(e) => setFormData({ ...formData, vehicleType3to5: e.target.value })}
                  placeholder="e.g., Minivan (Transporter)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-10 Pax Vehicle
                </label>
                <input
                  type="text"
                  value={formData.vehicleType6to10}
                  onChange={(e) => setFormData({ ...formData, vehicleType6to10: e.target.value })}
                  placeholder="e.g., Minibus (Sprinter)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete Route'}
            </button>

            <div className="flex space-x-4">
              <Link
                href="/admin/transfers"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
