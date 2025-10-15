'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import ImageSelector from '@/components/admin/ImageSelector';

interface Attraction {
  name: string;
  description: string;
  image: string;
  duration: string;
}

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Historical');
  const [region, setRegion] = useState('Marmara');
  const [heroImage, setHeroImage] = useState('');
  const [gradient, setGradient] = useState('from-blue-500 to-blue-700');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [gettingThere, setGettingThere] = useState('');

  // Attractions state
  const [attractions, setAttractions] = useState<Attraction[]>([
    { name: '', description: '', image: '', duration: '' }
  ]);

  // Experiences state
  const [experiences, setExperiences] = useState<string[]>(['']);

  // Fetch existing destination data
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/admin/destinations/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch destination');
        }
        const data = await response.json();

        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description);
        setCategory(data.category);
        setRegion(data.region);
        setHeroImage(data.heroImage);
        setGradient(data.gradient || 'from-blue-500 to-blue-700');
        setIsActive(data.isActive);
        setDisplayOrder(data.displayOrder);
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setBestTimeToVisit(data.bestTimeToVisit || '');
        setGettingThere(data.gettingThere || '');

        // Parse JSON fields
        const parsedAttractions = JSON.parse(data.attractions);
        setAttractions(parsedAttractions.length > 0 ? parsedAttractions : [{ name: '', description: '', image: '', duration: '' }]);

        const parsedExperiences = JSON.parse(data.experiences);
        setExperiences(parsedExperiences.length > 0 ? parsedExperiences : ['']);

        setFetching(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setFetching(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  // Attraction handlers
  const addAttraction = () => {
    setAttractions([...attractions, { name: '', description: '', image: '', duration: '' }]);
  };

  const removeAttraction = (index: number) => {
    setAttractions(attractions.filter((_, i) => i !== index));
  };

  const updateAttraction = (index: number, field: keyof Attraction, value: string) => {
    const updated = [...attractions];
    updated[index][field] = value;
    setAttractions(updated);
  };

  // Experience handlers
  const addExperience = () => {
    setExperiences([...experiences, '']);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, value: string) => {
    const updated = [...experiences];
    updated[index] = value;
    setExperiences(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!name || !slug || !description || !heroImage) {
        throw new Error('Please fill in all required fields');
      }

      // Filter out empty attractions and experiences
      const validAttractions = attractions.filter(a => a.name && a.description);
      const validExperiences = experiences.filter(e => e.trim());

      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          region,
          heroImage,
          gradient,
          attractions: JSON.stringify(validAttractions),
          experiences: JSON.stringify(validExperiences),
          bestTimeToVisit: bestTimeToVisit || null,
          gettingThere: gettingThere || null,
          isActive,
          displayOrder,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update destination');
      }

      router.push('/admin/destinations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Historical', 'Coastal', 'Natural', 'Cultural', 'Adventure'];
  const regions = ['Marmara', 'Aegean', 'Mediterranean', 'Central Anatolia', 'Black Sea'];
  const gradients = [
    'from-blue-500 to-blue-700',
    'from-green-500 to-green-700',
    'from-orange-500 to-orange-700',
    'from-purple-500 to-purple-700',
    'from-red-500 to-red-700',
    'from-teal-500 to-teal-700',
    'from-indigo-500 to-indigo-700',
    'from-pink-500 to-pink-700'
  ];

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Image
              src="/images/FunnyLogo1.png"
              alt="Funny Tourism"
              width={120}
              height={50}
              className="object-contain"
            />
            <h1 className="ml-6 text-2xl font-bold text-gray-900">Edit Destination: {name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin/destinations"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Destinations
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {regions.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visual Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image <span className="text-red-500">*</span>
                </label>
                <ImageSelector
                  selectedImage={heroImage}
                  onSelect={setHeroImage}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient
                </label>
                <select
                  value={gradient}
                  onChange={(e) => setGradient(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {gradients.map(grad => (
                    <option key={grad} value={grad}>{grad}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Attractions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Attractions</h2>
              <button
                type="button"
                onClick={addAttraction}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Attraction
              </button>
            </div>
            <div className="space-y-6">
              {attractions.map((attraction, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Attraction {index + 1}</h3>
                    {attractions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttraction(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={attraction.name}
                        onChange={(e) => updateAttraction(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={attraction.duration}
                        onChange={(e) => updateAttraction(index, 'duration', e.target.value)}
                        placeholder="e.g., 2-3 hours"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={attraction.description}
                        onChange={(e) => updateAttraction(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <ImageSelector
                        selectedImage={attraction.image}
                        onSelect={(path) => updateAttraction(index, 'image', path)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Experiences</h2>
              <button
                type="button"
                onClick={addExperience}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Experience
              </button>
            </div>
            <div className="space-y-3">
              {experiences.map((experience, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => updateExperience(index, e.target.value)}
                    placeholder="e.g., Bosphorus cruise between Europe and Asia"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Visit</label>
                <textarea
                  value={bestTimeToVisit}
                  onChange={(e) => setBestTimeToVisit(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Getting There</label>
                <textarea
                  value={gettingThere}
                  onChange={(e) => setGettingThere(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on website)</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">SEO (Optional)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/destinations"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              {loading ? (
                'Updating...'
              ) : (
                <>
                  <FaSave className="mr-2" /> Update Destination
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
