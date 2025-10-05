import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentTransfersClient from './AgentTransfersClient';

export default async function AgentTransfers() {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  return <AgentTransfersClient />;
}
