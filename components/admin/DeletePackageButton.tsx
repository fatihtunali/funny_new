'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

interface DeletePackageButtonProps {
  packageId: string;
  packageTitle: string;
}

export default function DeletePackageButton({ packageId, packageTitle }: DeletePackageButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${packageTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete package');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete package. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <FaTrash className="inline" />
    </button>
  );
}
