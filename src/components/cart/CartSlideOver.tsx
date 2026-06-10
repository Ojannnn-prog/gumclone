"use client";

import { useCartStore } from '@/store/useCartStore';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useAuthUIStore } from '@/store/useAuthUIStore';
import { createClient } from '@/lib/supabase/client';
import LoginModal from '@/components/auth/LoginModal';
import { useEffect, useState } from 'react';

export default function CartSlideOver() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isOpen = useCartUIStore((state) => state.isOpen);
  const close = useCartUIStore((state) => state.close);
  
  const isLoginModalOpen = useAuthUIStore((state) => state.isLoginModalOpen);
  const closeLoginModal = useAuthUIStore((state) => state.closeLoginModal);
  const openLoginModal = useAuthUIStore((state) => state.openLoginModal);
  
  const { items, addItem, decreaseQuantity, removeItem } = useCartStore();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) closeLoginModal();
    });

    return () => subscription.unsubscribe();
  }, [closeLoginModal]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md h-full bg-[#f4f4f0] border-l-4 border-black flex flex-col shadow-[-8px_0_0_0_rgba(0,0,0,1)] animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-white">
          <h2 className="text-2xl font-black uppercase tracking-tight">Your Cart</h2>
          <button 
            onClick={close}
            className="neo-box px-3 py-1 bg-red-400 font-bold uppercase text-sm"
          >
            Close
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-10 font-bold opacity-50">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="neo-box bg-white p-4 flex gap-4 relative">
                {/* Optional Image */}
                <div className="w-20 h-20 bg-emerald-200 border-2 border-black flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-2xl">🖼️</span>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold uppercase text-sm leading-tight">{item.name}</h4>
                    <p className="font-black text-pink-500 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-6 h-6 flex items-center justify-center border-2 border-black font-black bg-yellow-300 hover:bg-yellow-400 active:translate-y-[1px]"
                      >
                        -
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => addItem(item)}
                        className="w-6 h-6 flex items-center justify-center border-2 border-black font-black bg-yellow-300 hover:bg-yellow-400 active:translate-y-[1px]"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-bold underline hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="p-6 border-t-4 border-black bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold uppercase">Total ({totalItems} items):</span>
            <span className="text-2xl font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <button 
            onClick={async () => {
              if (!session) {
                openLoginModal();
                return;
              }

              try {
                setIsProcessing(true);
                
                const response = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items,
                    totalAmount: totalPrice,
                    customerEmail: session.user?.email,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create invoice');
                }

                if (data.invoice_url) {
                  // Redirect pembeli ke halaman Xendit Invoice
                  window.location.href = data.invoice_url;
                }
              } catch (error: any) {
                console.error("Checkout Error:", error);
                import("@/store/useToastStore").then((module) => {
                  module.useToastStore.getState().showToast(error.message, "error");
                });
              } finally {
                setIsProcessing(false);
              }
            }}
            disabled={items.length === 0 || isProcessing}
            className="w-full neo-box py-4 bg-purple-400 font-black uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 active:translate-y-[2px]"
          >
            {isProcessing ? "Processing..." : session ? "Proceed to Payment" : "Checkout"}
          </button>
        </div>
        
      </div>
    </div>
  );
}
