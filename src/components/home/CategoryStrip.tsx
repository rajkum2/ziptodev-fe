import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getCategories } from '../../api/endpoints';
import { CategoryStripSkeleton } from '../ui/Skeleton';

export function CategoryStrip() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  if (isLoading) return <CategoryStripSkeleton />;

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-4 py-2">
        {categories?.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/c/${category.slug}`}
              className="flex flex-col items-center gap-2 w-16 shrink-0 group"
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-shadow ring-2 ring-transparent group-hover:ring-violet-200"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-xs text-center text-gray-700 font-medium line-clamp-2 leading-tight">
                {category.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
