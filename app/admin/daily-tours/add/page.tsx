'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUpload, FaSave } from 'react-icons/fa';

interface DailyTour {
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
}

export default function AddDailyTourPage() {
  const router = useRouter();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tours, setTours] = useState<DailyTour[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'DAILY_TOUR' | 'SHORE_EXCURSION'>('DAILY_TOUR');

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
      formData.append('category', category);

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
        // Clear the form and redirect to list
        setTours([]);
        setSelectedFile(null);
        router.push('/admin/daily-tours');
        router.refresh();
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
    newTours[index] = { ...newTours[index], [field]: value };
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
          <h1 className="text-3xl font-bold text-gray-900">Add Daily Tour / Shore Excursion</h1>
          <p className="text-gray-600 mt-2">Upload a PDF to extract tour data using AI</p>
        </div>

        {/* PDF Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1: Upload PDF</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'DAILY_TOUR' | 'SHORE_EXCURSION')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="DAILY_TOUR">Daily City Tour</option>
              <option value="SHORE_EXCURSION">Shore Excursion (from cruise port)</option>
            </select>
          </div>

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
                        type="number"
                        value={tour.sicPrice}
                        onChange={(e) => updateTour(index, 'sicPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
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
      </div>
    </div>
  );
}
