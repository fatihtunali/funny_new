import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import AgentManagementClient from './AgentManagementClient';

export default async function AdminAgents() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return <AgentManagementClient />;
}
