import { getAdminFromToken } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import LeadsPageClient from './LeadsPageClient';

export default async function LeadsPage() {
  const admin = await getAdminFromToken();
  if (!admin) {
    redirect('/admin/login');
  }

  return <LeadsPageClient />;
}
