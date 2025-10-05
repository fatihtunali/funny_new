import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentDailyTourBookingClient from './AgentDailyTourBookingClient';

export default async function AgentDailyTourBooking({ params }: { params: Promise<{ id: string }> }) {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  const { id } = await params;

  return <AgentDailyTourBookingClient tourId={id} agentId={agent.id} commissionRate={agent.commissionRate} />;
}
