'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCheck, FaTimes, FaSave } from 'react-icons/fa';

export default function BatchReviewPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const extractedData = sessionStorage.getItem('extractedPackages');
    if (extractedData) {
      const parsed = JSON.parse(extractedData);
      setPackages(parsed);
      // Select all by default
      setSelectedPackages(new Set(parsed.map((_: any, idx: number) => idx)));
    } else {
      router.push('/admin/packages/add');
    }
  }, [router]);

  const togglePackage = (index: number) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPackages(newSelected);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');

    try {
      // Get next available package IDs
      const nextIdRes = await fetch('/api/admin/next-package-id');
      const nextIdData = await nextIdRes.json();
      let currentId = parseInt(nextIdData.nextId);

      const selectedPackageData = packages.filter((_, idx) => selectedPackages.has(idx));

      // Save each selected package
      for (const pkg of selectedPackageData) {
        const packageData = {
          packageId: String(currentId).padStart(2, '0'),
          packageType: pkg.packageType,
          title: pkg.title,
          slug: pkg.slug,
          duration: pkg.duration,
          description: pkg.description,
          destinations: pkg.destinations,
          image: pkg.image,
          pdfUrl: pkg.pdfUrl,
          isActive: true,
          highlights: JSON.stringify(pkg.highlights || []),
          included: JSON.stringify(pkg.included || []),
          notIncluded: JSON.stringify(pkg.notIncluded || []),
          itinerary: JSON.stringify(pkg.itinerary || []),
          pricing: JSON.stringify(pkg.pricing || {}),
          hotels: JSON.stringify(pkg.hotels || {}),
          ...(pkg.packageType === 'SHORE_EXCURSION' && {
            port: pkg.port,
            pickupType: pkg.pickupType
          }),
        };

        const res = await fetch('/api/admin/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(packageData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(`Failed to save "${pkg.title}": ${data.error || 'Unknown error'}`);
        }

        currentId++;
      }

      // Clear sessionStorage
      sessionStorage.removeItem('extractedPackages');

      // Redirect to dashboard
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
              <h1 className="text-2xl font-bold text-gray-900">Review Extracted Packages</h1>
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Found {packages.length} package{packages.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Select the packages you want to save ({selectedPackages.size} selected)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPackages(new Set(packages.map((_, idx) => idx)))}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedPackages(new Set())}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Deselect All
              </button>
              <button
                onClick={handleSaveAll}
                disabled={selectedPackages.size === 0 || saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                <FaSave className="mr-2" />
                {saving ? 'Saving...' : `Save ${selectedPackages.size} Package${selectedPackages.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const isSelected = selectedPackages.has(index);

            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => togglePackage(index)}
              >
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {isSelected && <FaCheck className="text-white" />}
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={pkg.image || '/images/hotelwithpackage.jpg'}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-white px-2 py-1 rounded text-xs font-semibold">
                      {pkg.packageId || `#${index + 1}`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {pkg.title}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-semibold mr-2">Type:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {pkg.packageType === 'SHORE_EXCURSION' ? 'Shore Excursion' :
                         pkg.packageType === 'LAND_ONLY' ? 'Land Only' : 'With Hotel'}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <span className="font-semibold mr-2">Duration:</span>
                      <span>{pkg.duration}</span>
                    </div>

                    {pkg.port && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-semibold mr-2">Port:</span>
                        <span>{pkg.port}</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <span className="font-semibold mr-2">Destinations:</span>
                      <span className="line-clamp-1">{pkg.destinations}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-gray-700 text-xs line-clamp-3">{pkg.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
