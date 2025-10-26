import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import ItinerariesClient from './ItinerariesClient';

export default async function AdminItinerariesPage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ItinerariesClient />
      </div>
    </div>
  );
}
