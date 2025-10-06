import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import AgentDetailClient from './AgentDetailClient';

export default async function AgentDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return <AgentDetailClient agentId={params.id} />;
}
