'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Travel Tips',
    status: 'DRAFT',
  });

  // All available images (excluding logos and non-photo files)
  const availableImages = [
    '/images/AntalyaOldCity.jpg',
    '/images/AntalyaHarbour.jpg',
    '/images/AntalyaOldCity1.jpg',
    '/images/BlueMosqueIstanbul.jpg',
    '/images/BosphorusBridgeNightIstanbul.jpg',
    '/images/BlueMosqueIstanbul6minarets.jpg',
    '/images/BosphorusCruiseIstanbul.jpg',
    '/images/BosphorusStraitIstanbul.jpg',
    '/images/BosphorusCruiseIstanbul2.jpg',
    '/images/Ephesus_Library.jpg',
    '/images/Ephesus_Library2.jpg',
    '/images/FairyChimneysCapppadocia.jpeg',
    '/images/Fethiye.jpg',
    '/images/Ferhiye-Marina.jpg',
    '/images/FethiyeBay.jpg',
    '/images/FethiyeMarina.jpg',
    '/images/HierapolisAntikKentiPamukkale.jpg',
    '/images/HierapolisAntikKentiPamukkale1.jpg',
    '/images/IstanbulatNight.jpeg',
    '/images/MaidenTowerIstanbul.jpg',
    '/images/MeryemAnaEvi.jpeg',
    '/images/OrtakoyMosqueIstanbul.jpg',
    '/images/MeryemAnaEvi2.jpeg',
    '/images/PamukkaleTravertenler.jpg',
    '/images/PamukkaleTravertenler1.jpg',
    '/images/PataraBeach.jpg',
    '/images/SideAntikKenti.jpg',
    '/images/SuleymaniyeMosqueIstanbul.jpg',
    '/images/antalyakekova.jpg',
    '/images/ayasofya.jpg',
    '/images/bluemosque.jpg',
    '/images/bursa1.jpg',
    '/images/cappadociaballoonride.jpg',
    '/images/camlica.jpg',
    '/images/cappadociaballoonride3.jpg',
    '/images/cappadociaballoonride2.jpg',
    '/images/cappadocianight.jpg',
    '/images/cappadocias.jpg',
    '/images/didyma.jpg',
    '/images/duden.jpg',
    '/images/fethiye-paragliding.jpg',
    '/images/fethiye-paragliding2.jpg',
    '/images/hotelwithpackage.jpg',
    '/images/izmir.jpg',
    '/images/pergamon.jpg',
    '/images/jeepsafari.jpg',
    '/images/side-aspendos.jpg',
    '/images/sirince.jpg',
    '/images/topkapipalacegeneraldrone.jpg',
    '/images/topkapipalacepanorama.jpg',
    '/images/topkapipalaceinside.jpg',
    '/images/transfer.jpg',
    '/images/mosque-4812260_1920.jpg',
    '/images/galata-tower-istanbul.jpg',
    '/images/MaidenTowerIstanbul-2.jpg',
    '/images/ortahisar-5678553_1280.jpg',
    '/images/istanbul-boat-tour.jpg',
    '/images/hot-air-balloons-1773468_1280.jpg',
    '/images/antalya-7729741_1280-kaleici.jpg',
    '/images/pamukalle-dark.jpg',
    '/images/eskisehir.jpg',
    '/images/antalya-sea-view-with-mountain.jpg',
    '/images/antalya-port.jpg',
    '/images/OrtakoyMosqueIstanbul-1.jpg',
    '/images/anitkabir.jpg',
    '/images/suleymaniye-istanbul.jpg',
  ];

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/blog/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setFormData({
          title: data.post.title,
          excerpt: data.post.excerpt,
          content: data.post.content,
          coverImage: data.post.coverImage,
          category: data.post.category,
          status: data.post.status,
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/blog/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('✅ Blog post updated successfully!');
        router.push('/admin/blog');
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog Management
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt * <span className="text-gray-500 font-normal">(Max 160 characters)</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                maxLength={160}
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/160 characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content * <span className="text-gray-500 font-normal">(HTML format)</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                rows={20}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Use HTML tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;
              </p>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image *
              </label>
              <select
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                {availableImages.map((img) => (
                  <option key={img} value={img}>
                    {img.replace('/images/', '')}
                  </option>
                ))}
              </select>
              {formData.coverImage && (
                <div className="mt-3">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Travel Tips">Travel Tips</option>
                <option value="Destinations">Destinations</option>
                <option value="Culture">Culture</option>
                <option value="Food">Food</option>
                <option value="History">History</option>
                <option value="Activities">Activities</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                <FaSave />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
