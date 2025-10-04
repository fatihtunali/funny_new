import { redirect } from 'next/navigation';
import { getAgentFromToken } from '@/lib/agentAuth';
import AgentPackageDetailClient from './AgentPackageDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentPackageDetail({ params }: Props) {
  const agent = await getAgentFromToken();

  if (!agent) {
    redirect('/agent/login');
  }

  const { id } = await params;

  return <AgentPackageDetailClient packageId={id} />;
}
