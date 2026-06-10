import ProductCard from './ProductCard';
import { Product } from '@/store/useCartStore';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Next.js Neo-Brutalism Template',
    description: 'A premium boilerplate for building robust e-commerce sites with a striking Neo-Brutalist design. Save weeks of UI development.',
    price: 150000,
  },
  {
    id: 'prod_2',
    name: 'Supabase Mastery Video Course',
    description: 'Learn how to build scalable backends with Supabase in this comprehensive 4-hour video course. From Auth to Row Level Security.',
    price: 250000,
  },
  {
    id: 'prod_3',
    name: 'Figma UI Kit: Gumclone',
    description: 'The exact Figma UI kit used to design this platform. Includes all components, variants, and design tokens for your next project.',
    price: 99000,
  },
];

export default function ProductFeed() {
  return (
    <section className="mt-24 w-full">
      <div className="flex items-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight bg-cyan-300 px-4 py-2 border-4 border-black shadow-neo inline-block transform -skew-x-2">
          Latest Products
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
