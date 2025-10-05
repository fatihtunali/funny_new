'use client';

import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

interface DeleteDailyTourButtonProps {
  tourId: string;
  tourTitle: string;
}

export default function DeleteDailyTourButton({ tourId, tourTitle }: DeleteDailyTourButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete: ${tourTitle}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/daily-tours/${tourId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        alert('Tour deleted successfully!');
        router.refresh();
      } else {
        alert('Failed to delete tour: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting tour');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900"
      title="Delete tour"
    >
      <FaTrash className="inline" />
    </button>
  );
}
