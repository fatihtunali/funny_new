import { redirect } from 'next/navigation';
import { getAdminFromToken } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import PackageForm from '@/components/admin/PackageForm';

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromToken();

  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const package_ = await prisma.package.findUnique({
    where: { id },
  });

  if (!package_) {
    redirect('/admin/dashboard');
  }

  return <PackageForm initialData={package_} isEdit={true} />;
}
