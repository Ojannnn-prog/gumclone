"use client";

import { Product } from '@/store/useCartStore';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="neo-box flex flex-col justify-between overflow-hidden group bg-white">
      {/* Product Image Placeholder / Block */}
      <div className="h-48 bg-emerald-200 border-b-2 border-black flex items-center justify-center p-4 relative">
         {product.imageUrl ? (
           <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full border-2 border-black" />
         ) : (
           <span className="font-black text-5xl opacity-80">🖼️</span>
         )}
         {/* Neo-brutalist badge */}
         <div className="absolute top-2 right-2 border-2 border-black bg-yellow-300 px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-3">
           Digital
         </div>
      </div>
      
      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-black uppercase tracking-tight leading-tight">{product.name}</h3>
        <p className="text-neutral-700 text-sm mt-3 flex-grow font-medium leading-relaxed">{product.description}</p>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="font-black text-2xl">Rp {product.price.toLocaleString('id-ID')}</span>
          <button 
            onClick={() => addItem(product)}
            className="neo-box px-5 py-2.5 bg-pink-400 font-black uppercase text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
