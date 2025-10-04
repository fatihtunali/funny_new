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
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  _count: {
    bookings: number;
  };
}

export default function AgentManagementClient() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch agents');
      }
      const data = await res.json();
      setAgents(data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (agentId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update agent');

      await fetchAgents();
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Failed to update agent status');
    }
  };

  const updateCommissionRate = async (agentId: string, commissionRate: number) => {
    try {
      const res = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRate }),
      });

      if (!res.ok) throw new Error('Failed to update commission rate');

      await fetchAgents();
    } catch (error) {
      console.error('Error updating commission:', error);
      alert('Failed to update commission rate');
    }
  };

  const deleteAgent = async (agentId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete agent');

      await fetchAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent');
    }
  };

  const filteredAgents = agents.filter(agent =>
    filter === 'ALL' || agent.status === filter
  );

  const statusCounts = {
    PENDING: agents.filter(a => a.status === 'PENDING').length,
    ACTIVE: agents.filter(a => a.status === 'ACTIVE').length,
    SUSPENDED: agents.filter(a => a.status === 'SUSPENDED').length,
    REJECTED: agents.filter(a => a.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
              <p className="text-gray-600 mt-1">Review and manage B2B travel agents</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/agents/add"
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                + Add Agent
              </Link>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              filter === 'ALL'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            <p className="text-sm text-gray-600">Total Agents</p>
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              filter === 'PENDING'
                ? 'border-yellow-600 bg-yellow-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              filter === 'ACTIVE'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-green-600">{statusCounts.ACTIVE}</p>
            <p className="text-sm text-gray-600">Active</p>
          </button>
          <button
            onClick={() => setFilter('SUSPENDED')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              filter === 'SUSPENDED'
                ? 'border-orange-600 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-orange-600">{statusCounts.SUSPENDED}</p>
            <p className="text-sm text-gray-600">Suspended</p>
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              filter === 'REJECTED'
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-red-600">{statusCounts.REJECTED}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </button>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{agent.companyName}</div>
                        <div className="text-sm text-gray-500">{agent.email}</div>
                        {agent.companyWebsite && (
                          <a
                            href={agent.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700"
                          >
                            {agent.companyWebsite}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.contactName}</div>
                      <div className="text-sm text-gray-500">{agent.phone}</div>
                      {agent.country && (
                        <div className="text-xs text-gray-500">{agent.country}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={agent.status}
                        onChange={(e) => updateAgentStatus(agent.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                          agent.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-300' :
                          agent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          agent.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                          'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={agent.commissionRate}
                        onChange={(e) => updateCommissionRate(agent.id, parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <span className="ml-1 text-sm text-gray-500">%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent._count.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteAgent(agent.id, agent.companyName)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No agents found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
