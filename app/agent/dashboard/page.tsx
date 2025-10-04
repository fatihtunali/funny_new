import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentDashboardClient from './AgentDashboardClient';

export default async function AgentDashboard() {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  return <AgentDashboardClient />;
}
