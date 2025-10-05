'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUpload, FaSave, FaEdit } from 'react-icons/fa';
import DeleteDailyTourButton from '@/components/admin/DeleteDailyTourButton';

interface DailyTour {
  tourCode: string;
  title: string;
  description: string;
  duration: string;
  city: string;
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
}

interface SavedTour extends DailyTour {
  id: string;
  isActive: boolean;
}

export default function AddDailyTourPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [savedTours, setSavedTours] = useState<SavedTour[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSavedTours();
  }, []);

  const fetchSavedTours = async () => {
    try {
      const res = await fetch('/api/admin/daily-tours');
      const data = await res.json();
      setSavedTours(data.tours || []);
    } catch (error) {
      console.error('Error fetching saved tours:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleExtractPDF = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file first');
      return;
    }

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const res = await fetch('/api/admin/extract-daily-tour', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setTours(data.tours);
        alert(`Successfully extracted ${data.tours.length} tour(s)!`);
      } else {
        alert('Failed to extract tour data: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Extract error:', error);
      alert('Error extracting PDF');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveTours = async () => {
    if (tours.length === 0) {
      alert('No tours to save');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/daily-tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tours }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Successfully saved ${data.count} tour(s)!`);
        // Clear the form and refresh the saved tours list
        setTours([]);
        setSelectedFile(null);
        fetchSavedTours(); // Refresh the list below
      } else {
        alert('Failed to save tours: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving tours');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTour = (index: number, field: keyof DailyTour, value: string | number) => {
    const newTours = [...tours];

    // Handle numeric fields - ensure valid numbers, treat "N/A" as 0
    if (field === 'sicPrice' || field === 'privateMin2' || field === 'privateMin4' ||
        field === 'privateMin6' || field === 'privateMin8' || field === 'privateMin10') {

      // If value is "N/A" or similar, set to 0
      if (typeof value === 'string' && value.toUpperCase().trim() === 'N/A') {
        newTours[index] = { ...newTours[index], [field]: 0 };
      } else {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        newTours[index] = { ...newTours[index], [field]: isNaN(numValue) ? 0 : numValue };
      }
    } else {
      newTours[index] = { ...newTours[index], [field]: value };
    }

    setTours(newTours);
  };

  const removeTour = (index: number) => {
    setTours(tours.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/daily-tours"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Daily Tours
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Daily Tour</h1>
          <p className="text-gray-600 mt-2">Upload a PDF to extract tour data using AI</p>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1: Upload PDF</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleExtractPDF}
            disabled={!selectedFile || isExtracting}
            className={`btn-primary flex items-center ${
              !selectedFile || isExtracting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaUpload className="mr-2" />
            {isExtracting ? 'Extracting...' : 'Extract Tour Data with AI'}
          </button>
        </div>

        {/* Extracted Tours */}
        {tours.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Step 2: Review & Save Tours ({tours.length})
              </h2>
              <button
                onClick={handleSaveTours}
                disabled={isSaving}
                className={`btn-primary flex items-center ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaSave className="mr-2" />
                {isSaving ? 'Saving...' : `Save All ${tours.length} Tours`}
              </button>
            </div>

            <div className="space-y-6">
              {tours.map((tour, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {tour.tourCode}: {tour.title}
                    </h3>
                    <button
                      onClick={() => removeTour(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tour Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Code
                      </label>
                      <input
                        type="text"
                        value={tour.tourCode}
                        onChange={(e) => updateTour(index, 'tourCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={tour.title}
                        onChange={(e) => updateTour(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={tour.city}
                        onChange={(e) => updateTour(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={tour.duration}
                        onChange={(e) => updateTour(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Pricing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SIC Price (€)
                      </label>
                      <input
                        type="text"
                        value={tour.sicPrice}
                        onChange={(e) => updateTour(index, 'sicPrice', e.target.value)}
                        placeholder="0 or N/A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter price or "N/A" if not available</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Min 2 Pax (€/person)
                      </label>
                      <input
                        type="number"
                        value={tour.privateMin2}
                        onChange={(e) => updateTour(index, 'privateMin2', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Min 4 Pax (€/person)
                      </label>
                      <input
                        type="number"
                        value={tour.privateMin4}
                        onChange={(e) => updateTour(index, 'privateMin4', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Min 6 Pax (€/person)
                      </label>
                      <input
                        type="number"
                        value={tour.privateMin6}
                        onChange={(e) => updateTour(index, 'privateMin6', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Min 8 Pax (€/person)
                      </label>
                      <input
                        type="number"
                        value={tour.privateMin8}
                        onChange={(e) => updateTour(index, 'privateMin8', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Min 10 Pax (€/person)
                      </label>
                      <input
                        type="number"
                        value={tour.privateMin10}
                        onChange={(e) => updateTour(index, 'privateMin10', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Description - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={tour.description}
                        onChange={(e) => updateTour(index, 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Tours List */}
        {savedTours.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Daily Tours ({savedTours.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SIC Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedTours.map((tour) => (
                    <tr key={tour.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tour.tourCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tour.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tour.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {tour.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        €{tour.sicPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tour.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tour.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/daily-tours/edit/${tour.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FaEdit className="inline" />
                          </Link>
                          <DeleteDailyTourButton
                            tourId={tour.id}
                            tourTitle={tour.title}
                            onDeleted={fetchSavedTours}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
