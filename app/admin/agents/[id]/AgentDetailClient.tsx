'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Agent {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  phone: string;
  country: string | null;
  address: string | null;
  commissionRate: number;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  companyWebsite: string | null;
  taxId: string | null;
  businessLicense: string | null;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  _count: {
    bookings: number;
  };
  bookings: Array<{
    id: string;
    tourDate: string;
    totalPrice: number;
    status: string;
    package: {
      title: string;
    } | null;
  }>;
}

export default function AgentDetailClient({ agentId }: { agentId: string }) {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`/api/admin/agents/${agentId}`);
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to fetch agent');
        }
        const data = await res.json();
        setAgent(data.agent);
      } catch (error) {
        console.error('Error fetching agent:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [agentId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
          <Link href="/admin/agents" className="btn-primary">
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agent.companyName}</h1>
              <p className="text-gray-600 mt-1">Agent Details</p>
            </div>
            <Link
              href="/admin/agents"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Agents
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Company Name</label>
                  <p className="mt-1 text-gray-900">{agent.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                  <p className="mt-1 text-gray-900">{agent.contactName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-gray-900">
                    <a href={`mailto:${agent.email}`} className="text-primary-600 hover:text-primary-700">
                      {agent.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-gray-900">{agent.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Country</label>
                  <p className="mt-1 text-gray-900">{agent.country || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Website</label>
                  <p className="mt-1 text-gray-900">
                    {agent.companyWebsite ? (
                      <a
                        href={agent.companyWebsite}
                        target="_blank"
                        rel="noopener"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {agent.companyWebsite}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                {agent.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-gray-900">{agent.address}</p>
                  </div>
                )}
                {agent.taxId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tax ID</label>
                    <p className="mt-1 text-gray-900">{agent.taxId}</p>
                  </div>
                )}
                {agent.businessLicense && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Business License</label>
                    <p className="mt-1 text-gray-900">{agent.businessLicense}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Booking History ({agent._count.bookings})
              </h2>
              {agent.bookings && agent.bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tour Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {agent.bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.package?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.tourDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            €{booking.totalPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No bookings yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Current Status</label>
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                      agent.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : agent.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : agent.status === 'SUSPENDED'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Commission Rate</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{agent.commissionRate}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Total Bookings</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{agent._count.bookings}</p>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Registered On</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {agent.approvedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Approved On</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(agent.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
