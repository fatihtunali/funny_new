import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import AddAgentClient from './AddAgentClient';

export default async function AdminAddAgent() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return <AddAgentClient />;
}
