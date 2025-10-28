'use client';

import { useState } from 'react';
import { FaBalanceScale, FaTimes } from 'react-icons/fa';
import { useComparison } from '@/contexts/ComparisonContext';
import { useTranslations } from 'next-intl';
import ComparisonModal from './ComparisonModal';

export default function ComparisonBar() {
  const t = useTranslations('comparisonBar');
  const { comparisonList, clearComparison } = useComparison();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (comparisonList.length === 0) return null;

  return (
    <>
      {/* Floating Comparison Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
        <div className="bg-primary-600 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4">
          <FaBalanceScale className="text-2xl" />
          <div>
            <p className="font-bold text-sm">
              {comparisonList.length} {comparisonList.length === 1 ? t('package') : t('packages')} {t('selected')}
            </p>
            <p className="text-xs text-primary-100">{t('clickToCompare')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary-600 px-6 py-2 rounded-full font-bold hover:bg-primary-50 transition-colors"
          >
            {t('compare')}
          </button>
          <button
            onClick={clearComparison}
            className="bg-primary-700 p-2 rounded-full hover:bg-primary-800 transition-colors"
            title={t('clearAll')}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
