'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMagic, FaEdit, FaTrash, FaEye, FaCalendar, FaRobot } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: string;
  isAIGenerated: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const url = filter === 'ALL' ? '/api/admin/blog' : `/api/admin/blog?status=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!confirm('Generate a new AI blog post? This will create a draft that you can review and edit.')) {
      return;
    }

    setGenerating(true);
    try {
      const categories = ['Travel Tips', 'Destinations', 'Culture', 'Food', 'History', 'Activities'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: randomCategory,
          autoPublish: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Blog post "${data.post.title}" generated successfully! (Category: ${randomCategory})\n\nSuggested Cover Image: ${data.coverImageSuggestion}`);
        fetchPosts();
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating post:', error);
      alert('Failed to generate post');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Blog post deleted!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });

      if (res.ok) {
        alert('Post published!');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
          <p className="text-gray-600">Manage your travel blog posts with AI-powered content generation</p>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleGeneratePost}
                disabled={generating}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                <FaMagic />
                {generating ? 'Generating...' : 'Generate AI Post'}
              </button>
              <Link
                href="/admin/blog/add"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <FaPlus />
                Create Manual Post
              </Link>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No blog posts found</p>
            <button
              onClick={handleGeneratePost}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Generate Your First Post
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Views</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Published</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {post.isAIGenerated && (
                          <FaRobot className="text-purple-600 mt-1 flex-shrink-0" title="AI Generated" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          post.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaEye className="text-sm" />
                        {post.views}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {post.publishedAt ? (
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <FaEye />
                          </button>
                        )}
                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
