import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from '../../api/endpoints';
import { Skeleton } from '../ui/Skeleton';
import { useUIStore } from '../../stores/uiStore';
import { clsx } from 'clsx';

export function CategorySidebar() {
  const { categorySlug } = useParams();
  const { isSidebarOpen } = useUIStore();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) {
    return (
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="hidden lg:block w-56 shrink-0"
          >
            <div className="sticky top-24 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="hidden lg:block w-56 shrink-0"
        >
          <div className="sticky top-24 bg-white rounded-xl shadow-sm p-3 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-900 px-3 py-2 border-b border-gray-100 mb-2">
              Categories
            </h2>
            <nav className="space-y-1">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/c/${category.slug}`}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    categorySlug === category.slug
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
