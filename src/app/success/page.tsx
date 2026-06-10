"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Kosongkan keranjang saat pembayaran berhasil
    clearCart();
    
    // Tampilkan notifikasi
    useToastStore.getState().showToast("Payment Successful!", "success");
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="neo-box max-w-2xl w-full bg-emerald-300 border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 md:p-12 text-center animate-in zoom-in duration-300 text-black">
        <h1 className="text-5xl md:text-6xl font-black uppercase mb-6 tracking-tighter">
          Payment <br/> <span className="bg-white px-4 border-4 border-black inline-block mt-4 transform rotate-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">Successful! 🚀</span>
        </h1>
        <p className="text-xl font-bold mb-10 border-4 border-black p-4 bg-white transform -rotate-1">
          Thank you for your purchase! The product links have been sent to your email.
        </p>
        <Link 
          href="/"
          className="inline-block border-4 border-black px-8 py-4 bg-yellow-300 font-black uppercase text-xl hover:bg-yellow-400 active:translate-y-[2px] transition-all shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
