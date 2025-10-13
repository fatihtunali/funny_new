'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaFileImport, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ImportItineraryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importedPackage, setImportedPackage] = useState<any>(null);

  // Option 1: Import from URL
  const [sourceUrl, setSourceUrl] = useState('');

  // Option 2: Paste JSON directly
  const [jsonData, setJsonData] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'json'>('url');

  const handleImportFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Fetch data from ruzgargucu.com
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data from source URL');
      }

      const data = await response.json();

      // Import to funny-new
      const importResponse = await fetch('/api/admin/import-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await importResponse.json();

      if (!importResponse.ok) {
        throw new Error(result.error || 'Failed to import itinerary');
      }

      setSuccess(`Successfully imported: ${result.package.title}`);
      setImportedPackage(result.package);
      setSourceUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromJson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Parse JSON
      const data = JSON.parse(jsonData);

      // Import to funny-new
      const importResponse = await fetch('/api/admin/import-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await importResponse.json();

      if (!importResponse.ok) {
        throw new Error(result.error || 'Failed to import itinerary');
      }

      setSuccess(`Successfully imported: ${result.package.title}`);
      setImportedPackage(result.package);
      setJsonData('');
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your JSON data.');
      } else {
        setError(err instanceof Error ? err.message : 'Import failed');
      }
    } finally {
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
                Import Itinerary from Ruzgar Gucu AI
              </h1>
            </div>
            <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 flex items-center">
            <FaCheckCircle className="text-green-600 mr-3 text-xl" />
            <div className="flex-1">
              <p className="font-semibold">{success}</p>
              {importedPackage && (
                <a
                  href={importedPackage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-800 underline mt-1 inline-block"
                >
                  View on website →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center">
            <FaExclamationTriangle className="text-red-600 mr-3 text-xl" />
            <p>{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FaFileImport className="mr-2" />
            How to Import Itineraries
          </h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Option 1: Import from URL</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Get the export URL from Ruzgar Gucu AI system</li>
              <li>Paste the URL below and click "Import from URL"</li>
            </ul>
            <p className="mt-3"><strong>Option 2: Import from JSON</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Copy the itinerary JSON from Ruzgar Gucu AI</li>
              <li>Paste the JSON data below and click "Import from JSON"</li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('url')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'url'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Import from URL
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'json'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Import from JSON
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Import from URL */}
            {activeTab === 'url' && (
              <form onSubmit={handleImportFromUrl}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Source URL from Ruzgar Gucu AI
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="https://ruzgargucu.com/api/export/itinerary/123"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the export API URL from your Ruzgar Gucu AI system
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !sourceUrl}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <FaFileImport className="mr-2" />
                      Import from URL
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Import from JSON */}
            {activeTab === 'json' && (
              <form onSubmit={handleImportFromJson}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Itinerary JSON Data
                  </label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 font-mono text-sm"
                    placeholder={`{
  "packageId": "01",
  "packageType": "WITH_HOTEL",
  "title": "Istanbul & Cappadocia Tour",
  "slug": "istanbul-cappadocia-tour",
  "duration": "5 Nights / 6 Days",
  "description": "...",
  "destinations": "Istanbul, Cappadocia",
  "image": "/images/cappadociaballoonride.jpg",
  "highlights": [...],
  "included": [...],
  "notIncluded": [...],
  "itinerary": [...],
  "pricing": {...},
  "hotels": {...}
}`}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Paste the complete JSON data exported from Ruzgar Gucu AI
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !jsonData}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <FaFileImport className="mr-2" />
                      Import from JSON
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Recent Imports */}
        {importedPackage && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Imported</h3>
            <div className="bg-gray-50 rounded p-4">
              <p className="font-semibold text-gray-900">{importedPackage.title}</p>
              <p className="text-sm text-gray-600 mt-1">Package ID: {importedPackage.packageId}</p>
              <p className="text-sm text-gray-600">Slug: {importedPackage.slug}</p>
              <div className="mt-3 flex space-x-3">
                <Link
                  href={`/admin/packages/edit/${importedPackage.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Edit Package →
                </Link>
                <a
                  href={importedPackage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-800 font-semibold"
                >
                  View Live →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
