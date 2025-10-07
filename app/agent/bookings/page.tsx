import { requireAgentWithPasswordCheck } from '@/lib/agentAuth';
import AgentBookingsClient from './AgentBookingsClient';

export default async function AgentBookings() {
  await requireAgentWithPasswordCheck();

  return <AgentBookingsClient />;
}
