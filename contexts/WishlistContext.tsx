'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[]; // Array of packageIds
  isInWishlist: (packageId: string) => boolean;
  addToWishlist: (packageId: string) => Promise<void>;
  removeFromWishlist: (packageId: string) => Promise<void>;
  toggleWishlist: (packageId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist.map((w: any) => w.packageId));
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (packageId: string) => {
    return wishlist.includes(packageId);
  };

  const addToWishlist = async (packageId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      if (res.ok) {
        setWishlist([...wishlist, packageId]);
      } else if (res.status === 401) {
        // Redirect to login
        window.location.href = '/login?redirect=/packages';
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (packageId: string) => {
    try {
      const res = await fetch(`/api/wishlist?packageId=${packageId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setWishlist(wishlist.filter(id => id !== packageId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const toggleWishlist = async (packageId: string) => {
    if (isInWishlist(packageId)) {
      await removeFromWishlist(packageId);
    } else {
      await addToWishlist(packageId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
