"use client";

import { useCartStore } from '@/store/useCartStore';

const products = [
  {
    id: 'prod_ebook_99',
    name: 'Paket ebook 99+ judul!',
    description: 'Paket ebook 99+ judul! lengkap mulai dari novel, edukasi, dll.',
    price: 49000,
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=ebooks',
  },
  {
    id: 'prod_editing_100',
    name: 'Paket editing lengkap!',
    description: '100+ paket editing (overlay, transisi, sound effect, dll).',
    price: 99000,
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=editing',
  }
];

export default function Home() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col items-center min-h-[60vh] space-y-12 py-12 w-full">
      <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight">
          Gumclone <br />
          <span className="bg-yellow-300 px-4 border-4 border-black inline-block mt-2 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
            Showcase
          </span>
        </h1>
        <p className="text-lg md:text-xl font-bold max-w-2xl mx-auto mt-6">
          Premium digital products ready for download.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {products.map((product) => (
          <div key={product.id} className="neo-box bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all text-black">
            <div className="w-full h-48 bg-pink-200 border-b-4 border-black flex items-center justify-center p-4">
               <img src={product.imageUrl} alt={product.name} className="h-full object-contain mix-blend-multiply" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-black uppercase mb-2">{product.name}</h3>
              <p className="font-bold text-gray-700 mb-6 flex-grow">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-black bg-emerald-300 border-2 border-black px-3 py-1 transform -rotate-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                <button 
                  onClick={() => {
                    addItem(product);
                    import("@/store/useToastStore").then(mod => mod.useToastStore.getState().showToast(`${product.name} added to cart!`));
                  }}
                  className="neo-box px-6 py-3 border-2 border-black bg-blue-400 font-black uppercase text-sm hover:bg-blue-500 active:translate-y-[2px]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
