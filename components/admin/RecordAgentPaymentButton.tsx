'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecordAgentPaymentButtonProps {
  bookingId: string;
  bookingType: 'Package' | 'Daily Tour' | 'Transfer';
  amountOwed: number;
  paidAmount: number;
}

export default function RecordAgentPaymentButton({
  bookingId,
  bookingType,
  amountOwed,
  paidAmount
}: RecordAgentPaymentButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  const remainingAmount = amountOwed - paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = bookingType === 'Package'
        ? '/api/admin/bookings/record-agent-payment'
        : bookingType === 'Daily Tour'
        ? '/api/admin/daily-tours/record-agent-payment'
        : '/api/admin/transfers/record-agent-payment';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount: parseFloat(amount),
          paymentMethod,
          transactionRef,
          notes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Payment recorded successfully!');
        setShowModal(false);
        router.refresh();
      } else {
        alert(data.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
      >
        Record Payment
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Record Agent Payment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-700">
                <strong>Amount Owed:</strong> €{amountOwed.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Already Paid:</strong> €{paidAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Remaining:</strong> €{remainingAmount.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Amount (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    max={remainingAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: €{remainingAmount.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select method...</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Transaction ID or check number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
