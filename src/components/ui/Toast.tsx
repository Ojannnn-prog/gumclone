"use client";

import { useToastStore } from "@/store/useToastStore";

export default function Toast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  if (!isVisible) return null;

  const bgColor = 
    type === 'success' ? 'bg-green-400' : 
    type === 'error' ? 'bg-red-400' : 
    'bg-yellow-400';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`neo-box px-6 py-4 border-4 border-black font-black uppercase text-sm ${bgColor} flex items-center justify-between gap-4 shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}>
        <span>{message}</span>
        <button 
          onClick={hideToast} 
          className="border-2 border-black bg-white w-6 h-6 flex items-center justify-center hover:bg-gray-200 active:translate-y-[2px]"
          aria-label="Close notification"
        >
          X
        </button>
      </div>
    </div>
  );
}
