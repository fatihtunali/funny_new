import { requireAgentWithPasswordCheck } from '@/lib/agentAuth';
import AgentDailyToursClient from './AgentDailyToursClient';

export default async function AgentDailyTours() {
  await requireAgentWithPasswordCheck();

  return <AgentDailyToursClient />;
}
