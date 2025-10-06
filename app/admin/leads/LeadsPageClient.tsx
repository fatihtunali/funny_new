'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaGlobe, FaSync, FaDownload, FaChartLine } from 'react-icons/fa';

interface Stats {
  total: number;
  withEmail: number;
  withWebsite: number;
  remaining: number;
  successRate: string;
}

interface ExtractionResult {
  companyName: string;
  email: string;
  source: string;
  city: string;
  country: string;
}

export default function LeadsPageClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [extractionSummary, setExtractionSummary] = useState<{
    processed: number;
    emailsFound: number;
    successRate: string;
  } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/extract-emails');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const startExtraction = async () => {
    if (!confirm(`Extract emails from ${limit} websites? This may take ${Math.ceil(limit * 15 / 60)} minutes.`)) {
      return;
    }

    try {
      setExtracting(true);
      setResults([]);
      setExtractionSummary(null);

      const response = await fetch('/api/admin/extract-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit }),
      });

      const data = await response.json();

      if (data.success) {
        setExtractionSummary({
          processed: data.processed,
          emailsFound: data.emailsFound,
          successRate: data.successRate,
        });
        setResults(data.results);
        await loadStats(); // Refresh stats
      } else {
        alert('Extraction failed: ' + data.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Extraction error: ' + errorMessage);
    } finally {
      setExtracting(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const csv = [
      'Company Name,Email,City,Country,Source',
      ...results.map(r =>
        `"${r.companyName}","${r.email}","${r.city}","${r.country}","${r.source}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Lead Management</h1>
        <p className="text-gray-600">Extract emails from discovered travel agency websites</p>
      </div>

      {/* Statistics Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">With Email</p>
                <p className="text-3xl font-bold text-gray-900">{stats.withEmail}</p>
              </div>
              <FaEnvelope className="text-4xl text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">With Website</p>
                <p className="text-3xl font-bold text-gray-900">{stats.withWebsite}</p>
              </div>
              <FaGlobe className="text-4xl text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">To Extract</p>
                <p className="text-3xl font-bold text-gray-900">{stats.remaining}</p>
                <p className="text-xs text-gray-500 mt-1">Success: {stats.successRate}%</p>
              </div>
              <FaSync className="text-4xl text-orange-500 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Extraction Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Extraction Tool</h2>

        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Websites to Process
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              disabled={extracting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Estimated time: {Math.ceil(limit * 15 / 60)} minutes (15 seconds per website)
            </p>
          </div>

          <button
            onClick={startExtraction}
            disabled={extracting || !stats || stats.remaining === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {extracting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Extracting...
              </>
            ) : (
              <>
                <FaSync /> Start Extraction
              </>
            )}
          </button>

          <button
            onClick={loadStats}
            disabled={loading || extracting}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Refresh Stats
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Visits each agency&apos;s website homepage and contact pages</li>
            <li>• Extracts email addresses from HTML content and mailto links</li>
            <li>• Validates and stores the first valid email found</li>
            <li>• Updates the database with extraction results</li>
            <li>• Typical success rate: 30-50% of websites</li>
          </ul>
        </div>
      </div>

      {/* Extraction Progress/Results */}
      {extracting && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Extraction in Progress</h3>
            <p className="text-gray-600">
              Processing {limit} websites... This may take a few minutes.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please keep this page open until completion.
            </p>
          </div>
        </div>
      )}

      {/* Extraction Summary */}
      {extractionSummary && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Extraction Results</h2>
            {results.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <FaDownload /> Export CSV
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">{extractionSummary.processed}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Emails Found</p>
              <p className="text-2xl font-bold text-green-900">{extractionSummary.emailsFound}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-900">{extractionSummary.successRate}%</p>
            </div>
          </div>

          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Found Emails ({results.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{result.companyName}</h4>
                        <p className="text-sm text-gray-600">{result.city}, {result.country}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {result.source}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <a
                        href={`mailto:${result.email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {result.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
