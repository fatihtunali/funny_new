import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import PackageForm from '@/components/admin/PackageForm';

export default async function AddPackagePage() {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  return <PackageForm />;
}
