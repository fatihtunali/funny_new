'use client';

import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  );
}
