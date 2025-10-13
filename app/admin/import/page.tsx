import { getAdminFromToken } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import ImportItineraryForm from '@/components/admin/ImportItineraryForm';

export default async function ImportItineraryPage() {
  const admin = await getAdminFromToken();
  if (!admin) {
    redirect('/admin/login');
  }

  return <ImportItineraryForm />;
}
