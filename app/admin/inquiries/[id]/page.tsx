import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from '@/components/admin/LogoutButton';
import MarkAsRepliedButton from '@/components/admin/MarkAsRepliedButton';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const inquiry = await prisma.contactInquiry.findUnique({
    where: { id },
  });

  if (!inquiry) {
    redirect('/admin/inquiries');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Image
                  src="/images/FunnyLogo1.png"
                  alt="Funny Tourism"
                  width={120}
                  height={50}
                  className="object-contain cursor-pointer"
                />
              </Link>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Inquiry Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/inquiries"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Inquiries
              </Link>
              <span className="text-gray-600">Welcome, {admin.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{inquiry.subject}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Received: {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                {inquiry.replied ? (
                  <span className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                    ✓ Replied
                  </span>
                ) : (
                  <span className="px-4 py-2 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                    Pending Reply
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-base font-medium text-gray-900">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-medium text-gray-900">
                  <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:text-blue-800">
                    {inquiry.email}
                  </a>
                </p>
              </div>
              {inquiry.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-medium text-gray-900">
                    <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:text-blue-800">
                      {inquiry.phone}
                    </a>
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="text-base font-medium text-gray-900">{inquiry.source || 'contact'}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">{inquiry.message}</pre>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <a
                href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Reply via Email
              </a>
              <a
                href={`https://wa.me/${inquiry.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inquiry.name}, thank you for your inquiry about "${inquiry.subject}". `)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Reply via WhatsApp
              </a>
            </div>
            {!inquiry.replied && (
              <MarkAsRepliedButton inquiryId={inquiry.id} redirectTo="/admin/inquiries" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
