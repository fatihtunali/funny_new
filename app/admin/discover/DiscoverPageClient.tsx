'use client';

import { useState } from 'react';
import { FaSearch, FaGlobe, FaCheck, FaTimes, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

interface DiscoveryResult {
  companyName: string;
  email?: string;
  website: string;
  city: string;
  country: string;
  searchQuery: string;
}

interface DiscoverySummary {
  totalFound?: number;
  totalScraped?: number;
  withEmail?: number;
  newLeads?: number;
  duplicates: number;
  breakdown: Record<string, number>;
}

export default function DiscoverPageClient() {
  const [discovering, setDiscovering] = useState(false);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [summary, setSummary] = useState<DiscoverySummary | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['USA', 'UK', 'Canada']);
  const [limit, setLimit] = useState(10);
  const [method, setMethod] = useState<'google-api' | 'google-maps'>('google-maps');

  const countries = [
    { value: 'USA', label: 'United States', cities: 7 },
    { value: 'UK', label: 'United Kingdom', cities: 3 },
    { value: 'Canada', label: 'Canada', cities: 3 },
    { value: 'Australia', label: 'Australia', cities: 2 },
    { value: 'Ireland', label: 'Ireland', cities: 1 },
    { value: 'New Zealand', label: 'New Zealand', cities: 1 },
  ];

  const startDiscovery = async () => {
    if (selectedCountries.length === 0) {
      alert('Please select at least one country');
      return;
    }

    const methodName = method === 'google-maps' ? 'Google Maps Scraping' : 'Google Search API';
    const warning = method === 'google-maps'
      ? 'This will scrape Google Maps (FREE, UNLIMITED, but slower).'
      : `This will use Google Search API (${limit} searches, may hit quota).`;

    if (!confirm(`Search for travel agencies in ${selectedCountries.join(', ')}?\n\nMethod: ${methodName}\n${warning}`)) {
      return;
    }

    try {
      setDiscovering(true);
      setResults([]);
      setSummary(null);

      const endpoint = method === 'google-maps' ? '/api/admin/scrape-google-maps' : '/api/admin/discover-agents';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries: selectedCountries,
          limit
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        setResults(data.results || []);
      } else {
        alert('Discovery failed: ' + data.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Discovery error: ' + errorMessage);
    } finally {
      setDiscovering(false);
    }
  };

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Discovery Tool</h1>
        <p className="text-gray-600">Automatically find travel agencies using Google Search</p>
      </div>

      {/* Discovery Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Settings</h2>

        {/* Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Discovery Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`
                flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                ${method === 'google-maps'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="method"
                value="google-maps"
                checked={method === 'google-maps'}
                onChange={() => setMethod('google-maps')}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary-600" />
                  Google Maps Scraping (Recommended)
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ✅ FREE & Unlimited<br />
                  ✅ Gets emails directly<br />
                  ⚠️ Slower (15-20 seconds per city)
                </div>
              </div>
            </label>

            <label
              className={`
                flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                ${method === 'google-api'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="method"
                value="google-api"
                checked={method === 'google-api'}
                onChange={() => setMethod('google-api')}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  Google Search API
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ⚠️ Limited (100/day free)<br />
                  ❌ No emails (needs extraction)<br />
                  ✅ Faster
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Countries to Search
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {countries.map(country => (
              <label
                key={country.value}
                className={`
                  flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${selectedCountries.includes(country.value)
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country.value)}
                    onChange={() => toggleCountry(country.value)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{country.label}</div>
                    <div className="text-xs text-gray-500">{country.cities} cities</div>
                  </div>
                </div>
                {selectedCountries.includes(country.value) && (
                  <FaCheck className="text-primary-600" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Limit Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Searches per Country
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="flex-1"
              disabled={discovering}
            />
            <span className="text-lg font-semibold text-gray-900 w-16">{limit}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Total API calls: {selectedCountries.length * limit} (Free tier: 100/day)
          </p>
        </div>

        {/* Start Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={startDiscovery}
            disabled={discovering || selectedCountries.length === 0}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            {discovering ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Searching...
              </>
            ) : (
              <>
                <FaSearch /> Start Discovery
              </>
            )}
          </button>

          <div className="text-sm text-gray-600">
            Estimated time: {Math.ceil(selectedCountries.length * limit * 2 / 60)} minutes
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Searches Google for travel agencies in major cities with direct flights to Istanbul</li>
            <li>• Uses search queries like &quot;turkey tour packages&quot;, &quot;istanbul tours&quot;, etc.</li>
            <li>• Extracts company name, website, and location from search results</li>
            <li>• Automatically detects and skips duplicates</li>
            <li>• Saves leads to database for email extraction</li>
          </ul>
        </div>
      </div>

      {/* Discovery Progress */}
      {discovering && (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery in Progress</h3>
            <p className="text-gray-600">
              Searching {selectedCountries.join(', ')}... Please wait.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take several minutes depending on the number of searches.
            </p>
          </div>
        </div>
      )}

      {/* Discovery Summary */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Discovery Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Total Scraped</p>
              <p className="text-3xl font-bold text-blue-900">{summary.totalScraped || summary.totalFound || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-600 flex items-center gap-1">
                <FaEnvelope /> With Email
              </p>
              <p className="text-3xl font-bold text-green-900">{summary.withEmail || summary.newLeads || 0}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600">No Email</p>
              <p className="text-3xl font-bold text-orange-900">
                {(summary.totalScraped || summary.totalFound || 0) - (summary.withEmail || summary.newLeads || 0)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Duplicates</p>
              <p className="text-3xl font-bold text-gray-900">{summary.duplicates}</p>
            </div>
          </div>

          {/* Breakdown by Country */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Breakdown by Country</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(summary.breakdown).map(([country, count]) => (
                <div key={country} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600">{country}</div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Results */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sample Results ({Math.min(results.length, 10)} of {results.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.slice(0, 10).map((result, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{result.companyName}</h4>
                        <p className="text-sm text-gray-600">{result.city}, {result.country}</p>
                        <p className="text-xs text-gray-500 mt-1">Query: {result.searchQuery}</p>
                      </div>
                    </div>
                    {result.email && (
                      <div className="mt-2 flex items-center gap-2">
                        <FaEnvelope className="text-green-500" />
                        <a
                          href={`mailto:${result.email}`}
                          className="text-sm text-green-600 hover:underline font-semibold"
                        >
                          {result.email}
                        </a>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <FaGlobe className="text-gray-400" />
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {result.website}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              <FaCheck className="inline mr-2" />
              Next Steps:
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>1. Go to <a href="/admin/leads" className="underline font-semibold">Agent Leads</a> page</li>
              <li>2. Run email extraction to find contact emails</li>
              <li>3. View and export the contacts</li>
              <li>4. Send partnership emails (100/day limit)</li>
            </ul>
          </div>
        </div>
      )}

      {/* API Quota Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaTimes className="text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900 mb-1">API Quota Limits</h3>
            <p className="text-sm text-yellow-800">
              Google Custom Search API has a free tier limit of <strong>100 searches per day</strong>.
              If you exceed this, you&apos;ll need to wait until tomorrow or upgrade to a paid plan.
              Current selection will use <strong>{selectedCountries.length * limit} searches</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
