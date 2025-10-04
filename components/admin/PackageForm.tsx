'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaFilePdf, FaMagic } from 'react-icons/fa';

interface PackageFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PackageForm({ initialData, isEdit = false }: PackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [extractionSuccess, setExtractionSuccess] = useState(false);

  // Basic Info
  const [packageId, setPackageId] = useState(initialData?.packageId || '');
  const [packageType, setPackageType] = useState(initialData?.packageType || 'WITH_HOTEL');
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [destinations, setDestinations] = useState(initialData?.destinations || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Shore Excursion specific fields
  const [port, setPort] = useState(initialData?.port || '');
  const [pickupType, setPickupType] = useState(initialData?.pickupType || 'both');

  // Highlights
  const [highlights, setHighlights] = useState(
    initialData?.highlights ? JSON.parse(initialData.highlights).join('\n') : ''
  );

  // Included/Not Included
  const [included, setIncluded] = useState(
    initialData?.included ? JSON.parse(initialData.included).join('\n') : ''
  );
  const [notIncluded, setNotIncluded] = useState(
    initialData?.notIncluded ? JSON.parse(initialData.notIncluded).join('\n') : ''
  );

  // Itinerary
  const [itinerary, setItinerary] = useState(
    initialData?.itinerary || JSON.stringify([
      { day: 1, title: '', description: '' }
    ], null, 2)
  );

  // Pricing - paxTiers pricing for WITH_HOTEL packages
  const [paxTiers, setPaxTiers] = useState<string[]>(() => {
    if (initialData?.pricing) {
      try {
        const parsed = JSON.parse(initialData.pricing);
        if (parsed.paxTiers) {
          return Object.keys(parsed.paxTiers).sort((a, b) => Number(a) - Number(b));
        }
      } catch {}
    }
    return ['2', '4', '6']; // Default pax tiers
  });

  const [pricingData, setPricingData] = useState(() => {
    if (initialData?.pricing) {
      try {
        const parsed = JSON.parse(initialData.pricing);
        if (parsed.paxTiers) {
          return parsed.paxTiers;
        }
      } catch {}
    }
    // Default paxTiers structure
    const defaultTiers: any = {};
    ['2', '4', '6'].forEach(tier => {
      defaultTiers[tier] = {
        threestar: { double: 0, triple: 0, singleSupplement: null },
        fourstar: { double: 0, triple: 0, singleSupplement: null },
        fivestar: { double: 0, triple: 0, singleSupplement: null }
      };
    });
    return defaultTiers;
  });

  // For LAND_ONLY packages - group size pricing
  const [landOnlyPricing, setLandOnlyPricing] = useState(() => {
    if (initialData?.pricing && packageType === 'LAND_ONLY') {
      try {
        const parsed = JSON.parse(initialData.pricing);
        return {
          twoAdults: parsed.twoAdults || 0,
          fourAdults: parsed.fourAdults || 0,
          sixAdults: parsed.sixAdults || 0,
        };
      } catch {
        return { twoAdults: 0, fourAdults: 0, sixAdults: 0 };
      }
    }
    return { twoAdults: 0, fourAdults: 0, sixAdults: 0 };
  });

  // For SHORE_EXCURSION packages - daily tour pricing by group size
  const [shoreExcursionPricing, setShoreExcursionPricing] = useState(() => {
    if (initialData?.pricing && packageType === 'SHORE_EXCURSION') {
      try {
        const parsed = JSON.parse(initialData.pricing);
        return parsed;
      } catch {}
    }
    return {
      perPerson: {
        '1pax': 0,
        '2pax': 0,
        '3pax': 0,
        '4pax': 0,
        '5pax': 0,
        '6pax': 0,
        '7to9pax': 0,
        '10to15pax': 0
      },
      children: {
        age0to2: 0,
        age3to6: 0,
        age7to12: 0
      }
    };
  });

  // Hotels
  const [hotels, setHotels] = useState(
    initialData?.hotels || JSON.stringify({
      threestar: [],
      fourstar: [],
      fivestar: []
    }, null, 2)
  );

  const handlePdfExtract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setError('');
    setExtractionSuccess(false);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/admin/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Extraction failed');
      }

      const data = result.data;

      // Get next package ID and unique slug
      const nextIdRes = await fetch('/api/admin/next-package-id');
      const nextIdData = await nextIdRes.json();

      // Populate all fields with extracted data
      setPackageId(nextIdData.nextId || data.packageId || '');
      setPackageType(data.packageType || 'WITH_HOTEL');
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setDuration(data.duration || '');
      setDescription(data.description || '');
      setDestinations(data.destinations || '');
      setImage(data.image || '');
      setPdfUrl(data.pdfUrl || '');
      setHighlights(data.highlights ? data.highlights.join('\n') : '');
      setIncluded(data.included ? data.included.join('\n') : '');
      setNotIncluded(data.notIncluded ? data.notIncluded.join('\n') : '');
      setItinerary(JSON.stringify(data.itinerary || [], null, 2));

      // Set shore excursion specific fields
      if (data.packageType === 'SHORE_EXCURSION') {
        setPort(data.port || '');
        setPickupType(data.pickupType || 'both');
      }

      // Set pricing data based on package type
      if (data.packageType === 'SHORE_EXCURSION' && data.pricing) {
        setShoreExcursionPricing(data.pricing);
      } else if (data.packageType === 'LAND_ONLY' && data.pricing) {
        setLandOnlyPricing({
          twoAdults: data.pricing.twoAdults || 0,
          fourAdults: data.pricing.fourAdults || 0,
          sixAdults: data.pricing.sixAdults || 0,
        });
      } else if (data.pricing?.paxTiers) {
        // WITH_HOTEL with paxTiers structure
        setPricingData(data.pricing.paxTiers);
        setPaxTiers(Object.keys(data.pricing.paxTiers).sort((a, b) => Number(a) - Number(b)));
      } else if (data.pricing) {
        // Fallback for old simple pricing format (shouldn't happen with new PDF extraction)
        setPricingData(data.pricing);
      }

      setHotels(JSON.stringify(data.hotels || {}, null, 2));

      setExtractionSuccess(true);
      setTimeout(() => setExtractionSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to extract PDF data');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate JSON fields
      JSON.parse(itinerary);
      JSON.parse(hotels);

      // Single pricing for everyone (public, agents, PDFs)
      let pricing;

      if (packageType === 'SHORE_EXCURSION') {
        pricing = shoreExcursionPricing;
      } else if (packageType === 'LAND_ONLY') {
        pricing = {
          twoAdults: landOnlyPricing.twoAdults,
          fourAdults: landOnlyPricing.fourAdults,
          sixAdults: landOnlyPricing.sixAdults,
        };
      } else {
        // For hotel packages - use paxTiers structure
        pricing = {
          paxTiers: pricingData
        };
      }

      const packageData = {
        packageId,
        packageType,
        title,
        slug,
        duration,
        description,
        destinations,
        image,
        pdfUrl,
        isActive,
        highlights: JSON.stringify(highlights.split('\n').filter((h: string) => h.trim())),
        included: JSON.stringify(included.split('\n').filter((i: string) => i.trim())),
        notIncluded: JSON.stringify(notIncluded.split('\n').filter((n: string) => n.trim())),
        itinerary,
        pricing: JSON.stringify(pricing), // Single pricing for everyone
        hotels,
        ...(packageType === 'SHORE_EXCURSION' && { port, pickupType }), // Add port and pickupType for shore excursions
      };

      const url = isEdit ? `/api/admin/packages/${initialData.id}` : '/api/admin/packages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save package');
        setLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please check your JSON fields.');
      setLoading(false);
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
                height={50}
                className="object-contain"
              />
              <h1 className="ml-6 text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Package' : 'Add New Package'}
              </h1>
            </div>
            <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {extractionSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
              ✓ PDF extracted successfully! Review and edit the fields below before saving.
            </div>
          )}

          {/* PDF Upload Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <FaMagic className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">AI-Powered PDF Extraction</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload your package PDF and let AI automatically extract all the details for you!
            </p>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfExtract}
                  disabled={extracting}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`flex items-center justify-center px-6 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${
                    extracting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaFilePdf className="text-2xl text-red-500 mr-3" />
                  <span className="text-sm font-semibold text-gray-700">
                    {extracting ? 'Extracting data...' : 'Click to upload PDF'}
                  </span>
                </label>
              </label>
            </div>
            {extracting && (
              <div className="mt-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-sm text-gray-600">AI is reading your PDF and extracting package details...</span>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package ID *
                </label>
                <input
                  type="text"
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., 01, 02, 03"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Type *
                </label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="WITH_HOTEL">With Hotels</option>
                  <option value="LAND_ONLY">Land Services Only</option>
                  <option value="SHORE_EXCURSION">Shore Excursion (Daily Tour)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., istanbul-package"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Istanbul Package"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., 3 Nights / 4 Days"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="Enter package description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destinations * (comma-separated)
                </label>
                <input
                  type="text"
                  value={destinations}
                  onChange={(e) => setDestinations(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Istanbul, Cappadocia"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="/images/package.jpg"
                  required
                />
              </div>
            </div>

            {/* Shore Excursion Specific Fields */}
            {packageType === 'SHORE_EXCURSION' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cruise Port *
                  </label>
                  <select
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Port</option>
                    <option value="Istanbul">Istanbul (Galataport)</option>
                    <option value="Kusadasi">Kusadasi</option>
                    <option value="Izmir">Izmir (Alsancak)</option>
                    <option value="Bodrum">Bodrum</option>
                    <option value="Antalya">Antalya</option>
                    <option value="Marmaris">Marmaris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Type *
                  </label>
                  <select
                    value={pickupType}
                    onChange={(e) => setPickupType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="port">Port Pickup Only</option>
                    <option value="hotel">Hotel Pickup Only</option>
                    <option value="both">Both Port & Hotel Pickup</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PDF URL
                </label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="/packages/package.pdf"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-700">Active Package</span>
                </label>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Highlights</h2>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Package Highlights (one per line)
            </label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              placeholder="Blue Mosque & Hagia Sophia&#10;Hot air balloon ride&#10;Ancient city of Ephesus"
            />
          </div>

          {/* Included/Not Included */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Included/Not Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Included (one per line)
                </label>
                <textarea
                  value={included}
                  onChange={(e) => setIncluded(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                  placeholder="Hotel accommodation&#10;Airport transfers&#10;Professional guide"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Not Included (one per line)
                </label>
                <textarea
                  value={notIncluded}
                  onChange={(e) => setNotIncluded(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                  placeholder="International flights&#10;Personal expenses&#10;Tips and gratuities"
                />
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Itinerary (JSON)</h2>
            <p className="text-sm text-gray-600 mb-3">
              Format: [{`{"day": 1, "title": "Arrival", "description": "..."}`}, ...]
            </p>
            <textarea
              value={itinerary}
              onChange={(e) => setItinerary(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              placeholder='[{"day": 1, "title": "Arrival in Istanbul", "description": "..."}]'
            />
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Pricing</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 font-medium mb-1">
                💡 Single Pricing + Commission Model:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enter <strong>final selling prices</strong> (same for everyone)</li>
                <li>• Prices shown on website, PDFs, and to agents are <strong>the same</strong></li>
                <li>• Agents earn commission based on their commission rate (e.g., 15%)</li>
                <li>• Example: €500 package → Agent with 15% commission earns €75</li>
              </ul>
            </div>

            {packageType === 'SHORE_EXCURSION' ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shore Excursion Pricing - Per Person (€)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set different prices based on group size. Price decreases as group size increases.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Per Person Rates by Group Size</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(shoreExcursionPricing.perPerson).map(([key, value]) => {
                        const label = key === '1pax' ? '1 Person' :
                                     key === '2pax' ? '2 People' :
                                     key === '3pax' ? '3 People' :
                                     key === '4pax' ? '4 People' :
                                     key === '5pax' ? '5 People' :
                                     key === '6pax' ? '6 People' :
                                     key === '7to9pax' ? '7-9 People' :
                                     '10-15 People';

                        return (
                          <div key={key}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {label} - Per Person (€)
                            </label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setShoreExcursionPricing({
                                ...shoreExcursionPricing,
                                perPerson: { ...shoreExcursionPricing.perPerson, [key]: Number(e.target.value) }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                              placeholder="0"
                              min="0"
                              step="1"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Child Pricing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age 0-2 Years (€)
                        </label>
                        <input
                          type="number"
                          value={shoreExcursionPricing.children.age0to2}
                          onChange={(e) => setShoreExcursionPricing({
                            ...shoreExcursionPricing,
                            children: { ...shoreExcursionPricing.children, age0to2: Number(e.target.value) }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          placeholder="0"
                          min="0"
                          step="1"
                        />
                        <p className="mt-1 text-xs text-gray-500">Usually free</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age 3-6 Years (€)
                        </label>
                        <input
                          type="number"
                          value={shoreExcursionPricing.children.age3to6}
                          onChange={(e) => setShoreExcursionPricing({
                            ...shoreExcursionPricing,
                            children: { ...shoreExcursionPricing.children, age3to6: Number(e.target.value) }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          placeholder="0"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Age 7-12 Years (€)
                        </label>
                        <input
                          type="number"
                          value={shoreExcursionPricing.children.age7to12}
                          onChange={(e) => setShoreExcursionPricing({
                            ...shoreExcursionPricing,
                            children: { ...shoreExcursionPricing.children, age7to12: Number(e.target.value) }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          placeholder="0"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : packageType === 'LAND_ONLY' ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Land Only Pricing - Per Person (€)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Set different prices based on group size. Price decreases as group size increases.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      2 Adults (2 Pax) - Per Person Price (€)
                    </label>
                    <input
                      type="number"
                      value={landOnlyPricing.twoAdults}
                      onChange={(e) => setLandOnlyPricing({ ...landOnlyPricing, twoAdults: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="500"
                      min="0"
                      step="1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Total for 2 pax: €{landOnlyPricing.twoAdults * 2} | Agent commission (15%): €{Math.round(landOnlyPricing.twoAdults * 2 * 0.15)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      4 Adults (4 Pax) - Per Person Price (€)
                    </label>
                    <input
                      type="number"
                      value={landOnlyPricing.fourAdults}
                      onChange={(e) => setLandOnlyPricing({ ...landOnlyPricing, fourAdults: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="400"
                      min="0"
                      step="1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Total for 4 pax: €{landOnlyPricing.fourAdults * 4} | Agent commission (15%): €{Math.round(landOnlyPricing.fourAdults * 4 * 0.15)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      6+ Adults (6+ Pax) - Per Person Price (€)
                    </label>
                    <input
                      type="number"
                      value={landOnlyPricing.sixAdults}
                      onChange={(e) => setLandOnlyPricing({ ...landOnlyPricing, sixAdults: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="350"
                      min="0"
                      step="1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Total for 6 pax: €{landOnlyPricing.sixAdults * 6} | Agent commission (15%): €{Math.round(landOnlyPricing.sixAdults * 6 * 0.15)}
                    </p>
                    <p className="mt-2 text-xs text-blue-600 font-medium">
                      This rate applies to all groups of 6 or more adults
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pax Tiers Management */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Pax Tiers (Group Sizes)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newTier = prompt('Enter pax tier number (e.g., 8, 10, 12):');
                        if (newTier && !paxTiers.includes(newTier)) {
                          const updatedTiers = [...paxTiers, newTier].sort((a, b) => Number(a) - Number(b));
                          setPaxTiers(updatedTiers);
                          setPricingData({
                            ...pricingData,
                            [newTier]: {
                              threestar: { double: 0, triple: 0, singleSupplement: null },
                              fourstar: { double: 0, triple: 0, singleSupplement: null },
                              fivestar: { double: 0, triple: 0, singleSupplement: null }
                            }
                          });
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      + Add Tier
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paxTiers.map(tier => (
                      <span key={tier} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tier} pax
                        {paxTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setPaxTiers(paxTiers.filter(t => t !== tier));
                              const newData = { ...pricingData };
                              delete newData[tier];
                              setPricingData(newData);
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-900"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing Table for Each Hotel Category */}
                {['threestar', 'fourstar', 'fivestar'].map((category) => {
                  const stars = category === 'threestar' ? '⭐⭐⭐' : category === 'fourstar' ? '⭐⭐⭐⭐' : '⭐⭐⭐⭐⭐';
                  const categoryLabel = category === 'threestar' ? '3-Star' : category === 'fourstar' ? '4-Star' : '5-Star';

                  return (
                    <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{stars} {categoryLabel} Hotels</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pax Tier</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PP in DBL (€)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PP in TRPL (€)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Single Suppl. (€)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paxTiers.map(tier => {
                              const tierData = pricingData[tier]?.[category] || { double: 0, triple: 0, singleSupplement: null };
                              return (
                                <tr key={tier}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{tier} pax</td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={tierData.double || 0}
                                      onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setPricingData({
                                          ...pricingData,
                                          [tier]: {
                                            ...pricingData[tier],
                                            [category]: {
                                              ...pricingData[tier][category],
                                              double: value,
                                              triple: value // Auto-copy to triple
                                            }
                                          }
                                        });
                                      }}
                                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-600"
                                      placeholder="0"
                                      min="0"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Comm: €{Math.round((tierData.double || 0) * 0.15)}</p>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={tierData.triple || 0}
                                      readOnly
                                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed"
                                      placeholder="0"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Auto-synced • Comm: €{Math.round((tierData.triple || 0) * 0.15)}</p>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="number"
                                      value={tierData.singleSupplement || ''}
                                      onChange={(e) => {
                                        const value = e.target.value === '' ? null : Number(e.target.value);
                                        setPricingData({
                                          ...pricingData,
                                          [tier]: {
                                            ...pricingData[tier],
                                            [category]: {
                                              ...pricingData[tier][category],
                                              singleSupplement: value
                                            }
                                          }
                                        });
                                      }}
                                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-600"
                                      placeholder="Optional"
                                      min="0"
                                    />
                                    {tierData.singleSupplement && (
                                      <p className="text-xs text-gray-500 mt-1">Comm: €{Math.round(tierData.singleSupplement * 0.15)}</p>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hotels - Only for WITH_HOTEL packages */}
          {packageType === 'WITH_HOTEL' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Hotels (JSON)</h2>
              <p className="text-sm text-gray-600 mb-3">
                Format: {`{"threestar": ["Hotel A", "Hotel B"], "fourstar": [...], ...}`}
              </p>
              <textarea
                value={hotels}
                onChange={(e) => setHotels(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/dashboard" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center disabled:bg-gray-400"
            >
              <FaSave className="mr-2" />
              {loading ? 'Saving...' : isEdit ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
