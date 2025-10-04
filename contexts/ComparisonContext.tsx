'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ComparisonContextType {
  comparisonList: string[]; // Array of packageIds
  isInComparison: (packageId: string) => boolean;
  addToComparison: (packageId: string) => void;
  removeFromComparison: (packageId: string) => void;
  toggleComparison: (packageId: string) => void;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const maxItems = 3;

  const isInComparison = (packageId: string) => {
    return comparisonList.includes(packageId);
  };

  const addToComparison = (packageId: string) => {
    if (comparisonList.length >= maxItems) {
      alert(`You can only compare up to ${maxItems} packages at a time`);
      return;
    }
    if (!comparisonList.includes(packageId)) {
      setComparisonList([...comparisonList, packageId]);
    }
  };

  const removeFromComparison = (packageId: string) => {
    setComparisonList(comparisonList.filter(id => id !== packageId));
  };

  const toggleComparison = (packageId: string) => {
    if (isInComparison(packageId)) {
      removeFromComparison(packageId);
    } else {
      addToComparison(packageId);
    }
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      isInComparison,
      addToComparison,
      removeFromComparison,
      toggleComparison,
      clearComparison,
      maxItems
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
