"use client";

import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const [mounted, setMounted] = useState(false);
  const openCart = useCartUIStore((state) => state.open);
  
  // FIXED: We must select the actual 'items' state for Zustand to trigger re-renders. 
  // Selecting a method like state.getTotalItems won't trigger re-renders because the method reference itself never changes.
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Prevent hydration mismatch by only rendering the dynamic count after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button 
      onClick={openCart}
      className="neo-box px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-sm bg-yellow-300 hover:bg-yellow-400 cursor-pointer"
    >
      Cart ({mounted ? totalItems : 0})
    </button>
  );
}

