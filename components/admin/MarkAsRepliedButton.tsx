'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MarkAsRepliedButton({
  inquiryId,
  redirectTo
}: {
  inquiryId: string;
  redirectTo?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsReplied = async () => {
    if (!confirm('Mark this inquiry as replied?')) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replied: true }),
      });

      if (response.ok) {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        alert('Failed to update inquiry');
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkAsReplied}
      disabled={isLoading}
      className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Updating...' : 'Mark as Replied'}
    </button>
  );
}
