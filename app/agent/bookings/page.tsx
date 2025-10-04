import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentBookingsClient from './AgentBookingsClient';

export default async function AgentBookings() {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  return <AgentBookingsClient />;
}
