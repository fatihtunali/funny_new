import { getAdminFromToken } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import DiscoverPageClient from './DiscoverPageClient';

export default async function DiscoverPage() {
  const admin = await getAdminFromToken();
  if (!admin) {
    redirect('/admin/login');
  }

  return <DiscoverPageClient />;
}
