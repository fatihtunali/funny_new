'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Agent {
  id: string;
  email: string;
  companyName: string;
  contactName: string;
  phone: string;
  country: string | null;
  address: string | null;
  commissionRate: number;
  status: string;
  logoUrl: string | null;
  primaryColor: string | null;
  companyWebsite: string | null;
  createdAt: string;
  approvedAt: string | null;
}

interface BookingStats {
  totalBookings: number;
  totalCommission: number;
  totalRevenue: number;
}

export default function AgentDashboardClient() {
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<BookingStats>({ totalBookings: 0, totalCommission: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
    fetchBookingStats();
  }, []);

  const fetchAgentData = async () => {
    try {
      const res = await fetch('/api/agent/me');
      if (!res.ok) {
        router.push('/agent/login');
        return;
      }
      const data = await res.json();
      setAgent(data.agent);
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingStats = async () => {
    try {
      const res = await fetch('/api/agent/bookings');
      if (!res.ok) return;
      const data = await res.json();
      const bookings = data.bookings || [];

      setStats({
        totalBookings: bookings.length,
        totalCommission: bookings.reduce((sum: number, b: any) => sum + (b.commissionAmount || 0), 0),
        totalRevenue: bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0),
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/agent/logout', { method: 'POST' });
      router.push('/agent/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Portal</h1>
              <p className="text-sm text-gray-600">{agent.companyName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`mb-6 p-4 rounded-lg ${
          agent.status === 'ACTIVE' ? 'bg-green-50 border border-green-200' :
          agent.status === 'PENDING' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-1">
              <p className="font-medium">
                {agent.status === 'ACTIVE' && '✓ Account Active'}
                {agent.status === 'PENDING' && '⏳ Pending Approval'}
                {agent.status === 'SUSPENDED' && '⛔ Account Suspended'}
                {agent.status === 'REJECTED' && '✕ Application Rejected'}
              </p>
              <p className="text-sm mt-1">
                {agent.status === 'ACTIVE' && `Your commission rate: ${agent.commissionRate}%`}
                {agent.status === 'PENDING' && 'Your account is awaiting admin approval. You will be notified once approved.'}
                {agent.status === 'SUSPENDED' && 'Your account has been suspended. Please contact support.'}
                {agent.status === 'REJECTED' && 'Your application was rejected. Please contact support for details.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
            <Link href="/agent/bookings" className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block">
              View all →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">€{stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Customer payments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Your Commission</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">€{stats.totalCommission.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Earned commission</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Commission Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{agent.commissionRate}%</p>
            <p className="text-sm text-gray-600 mt-1">On all bookings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/agent/packages"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-medium text-gray-900">Browse Packages</h3>
              <p className="text-sm text-gray-600 mt-1">View available tours</p>
            </Link>
            <Link
              href="/agent/bookings"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-medium text-gray-900">My Bookings</h3>
              <p className="text-sm text-gray-600 mt-1">Manage customer bookings</p>
            </Link>
            <Link
              href="/agent/bookings"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-medium text-gray-900">Commission Report</h3>
              <p className="text-sm text-gray-600 mt-1">View earnings</p>
            </Link>
          </div>
        </div>

        {/* Agent Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Company Name</p>
              <p className="font-medium text-gray-900 mt-1">{agent.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Name</p>
              <p className="font-medium text-gray-900 mt-1">{agent.contactName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900 mt-1">{agent.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900 mt-1">{agent.phone}</p>
            </div>
            {agent.country && (
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium text-gray-900 mt-1">{agent.country}</p>
              </div>
            )}
            {agent.companyWebsite && (
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a
                  href={agent.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 hover:text-primary-700 mt-1 inline-block"
                >
                  {agent.companyWebsite}
                </a>
              </div>
            )}
            {agent.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900 mt-1">{agent.address}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(agent.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {agent.approvedAt && (
              <div>
                <p className="text-sm text-gray-500">Approved On</p>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date(agent.approvedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
