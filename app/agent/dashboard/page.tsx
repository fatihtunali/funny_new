import { requireAgentWithPasswordCheck } from '@/lib/agentAuth';
import AgentDashboardClient from './AgentDashboardClient';

export default async function AgentDashboard() {
  await requireAgentWithPasswordCheck();

  return <AgentDashboardClient />;
}
