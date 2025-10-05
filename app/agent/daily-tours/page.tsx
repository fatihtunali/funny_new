import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentDailyToursClient from './AgentDailyToursClient';

export default async function AgentDailyTours() {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  return <AgentDailyToursClient />;
}
