import { requireAgentWithPasswordCheck } from '@/lib/agentAuth';
import AgentPackagesClient from './AgentPackagesClient';

export default async function AgentPackages() {
  await requireAgentWithPasswordCheck();

  return <AgentPackagesClient />;
}
