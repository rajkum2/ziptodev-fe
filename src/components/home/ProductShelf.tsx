import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import type { Shelf, Product } from '../../types';

interface ProductShelfProps {
  shelf: Shelf;
  isDesktop?: boolean;
}

export function ProductShelf({ shelf, isDesktop = false }: ProductShelfProps) {
  // Products are already populated in productIds for featured shelves
  const products = shelf.productIds.filter(
    (item): item is Product => typeof item === 'object' && item !== null
  );

  if (!products.length) return null;

  const linkTo = shelf.categorySlug ? `/c/${shelf.categorySlug}` : `/search?q=${shelf.title}`;
  const shelfId = shelf._id || shelf.id;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{shelf.title}</h2>
          {shelf.subtitle && (
            <p className="text-sm text-gray-500">{shelf.subtitle}</p>
          )}
        </div>
        <Link
          to={linkTo}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isDesktop ? (
        <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product, index) => (
            <motion.div
              key={product._id || product.id || `${shelfId}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3">
            {products.map((product, index) => (
              <motion.div
                key={product._id || product.id || `${shelfId}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-36 shrink-0"
              >
                <ProductCard product={product} variant="compact" />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
