import { requireAgentWithPasswordCheck } from '@/lib/agentAuth';
import AgentTransfersClient from './AgentTransfersClient';

export default async function AgentTransfers() {
  await requireAgentWithPasswordCheck();

  return <AgentTransfersClient />;
}
