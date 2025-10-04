import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentPackagesClient from './AgentPackagesClient';

export default async function AgentPackages() {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  return <AgentPackagesClient />;
}
