'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaEye, FaTag, FaArrowLeft, FaShare } from 'react-icons/fa';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  views: number;
  publishedAt: string;
  authorName: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface Package {
  id: string;
  packageId: string;
  slug: string;
  title: string;
  duration: string;
  destinations: string;
  image: string;
  pricing: string;
  b2bPricing: string | null;
  packageType: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog/${resolvedParams.slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);

        // Fetch related posts
        const relatedRes = await fetch(`/api/blog?category=${encodeURIComponent(data.post.category)}&limit=3`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedPosts(relatedData.posts.filter((p: BlogPost) => p.slug !== resolvedParams.slug));
        }

        // Fetch related packages
        const packagesRes = await fetch(`/api/blog/${resolvedParams.slug}/related-packages`);
        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          setRelatedPackages(packagesData.packages);
        }
      } else {
        // Post not found
        setPost(null);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getPriceRange = (pkg: Package) => {
    try {
      const pricingStr = pkg.b2bPricing || pkg.pricing;
      if (!pricingStr) return 'Contact for pricing';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pricing = JSON.parse(pricingStr) as any;

      if (pkg.packageType === 'LAND_ONLY') {
        const prices = [];
        if (pricing.perPerson) prices.push(pricing.perPerson);
        if (pricing.per_person) prices.push(pricing.per_person);
        if (pricing.twoAdults) prices.push(pricing.twoAdults);
        if (pricing.fourAdults) prices.push(pricing.fourAdults);
        if (pricing.sixAdults) prices.push(pricing.sixAdults);

        const validPrices = prices.filter(p => p != null && p > 0);
        if (validPrices.length === 0) return 'Contact for pricing';
        const min = Math.min(...validPrices);
        return `From €${min}`;
      } else if (pkg.packageType === 'DAILY_TOUR') {
        const prices = [
          pricing.sicPrice,
          pricing.privateMin2,
          pricing.privateMin4,
          pricing.privateMin6,
          pricing.privateMin8,
          pricing.privateMin10
        ].filter(p => p != null && p > 0);

        if (prices.length === 0) return 'Contact for pricing';
        const min = Math.min(...prices);
        return `From €${min}`;
      } else {
        const prices = [];
        if (pricing.paxTiers) {
          const firstTier = pricing.paxTiers[Object.keys(pricing.paxTiers)[0]];
          if (firstTier) {
            if (firstTier.threestar?.double) prices.push(firstTier.threestar.double);
            if (firstTier.fourstar?.double) prices.push(firstTier.fourstar.double);
            if (firstTier.fivestar?.double) prices.push(firstTier.fivestar.double);
          }
        }
        if (pricing.threestar?.double) prices.push(pricing.threestar.double);
        if (pricing.fourstar?.double) prices.push(pricing.fourstar.double);
        if (pricing.fivestar?.double) prices.push(pricing.fivestar.double);

        const validPrices = prices.filter(p => p != null && p > 0);
        if (validPrices.length === 0) return 'Contact for pricing';
        const min = Math.min(...validPrices);
        return `From €${min}`;
      }
    } catch (error) {
      console.error('Error parsing pricing:', error);
      return 'Contact for pricing';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <FaClock />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-2">
                <FaEye />
                {post.views} views
              </div>
              <div>By {post.authorName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Excerpt */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-primary-600 pl-6 italic">
            {post.excerpt}
          </p>

          {/* Share Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaShare />
              Share
            </button>
          </div>

          {/* Blog Content */}
          <div
            className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:my-6 prose-li:my-2
            prose-img:rounded-lg prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <FaTag className="text-xs" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Related Tour Packages</h2>
            <p className="text-gray-600 mb-8">Turn your travel inspiration into reality with these carefully selected tours</p>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.slug}`}>
                  <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow h-full">
                    <div className="relative h-48">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-sm font-bold">{getPriceRange(pkg)}</span>
                      </div>
                      {/* Package ID */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-gray-700">
                          #{pkg.packageId}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold">{pkg.duration}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[3rem] line-clamp-2 hover:text-primary-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{pkg.destinations}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-40">
                      <Image
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience Turkey?</h3>
          <p className="mb-6">Explore our curated tour packages and start planning your adventure!</p>
          <Link href="/packages" className="btn-secondary bg-white hover:bg-gray-100 text-primary-600">
            View Tour Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
