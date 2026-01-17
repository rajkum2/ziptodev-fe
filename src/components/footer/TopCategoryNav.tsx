import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { getCategories } from '../../api/endpoints';

export function TopCategoryNav() {
  const location = useLocation();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const isActive = (route: string) => {
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  };

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-100 sticky top-[73px] lg:top-[81px] z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 px-4 lg:px-6 py-3">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-[73px] lg:top-[81px] z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {/* All link */}
          <Link
            to="/"
            className={clsx(
              'flex-shrink-0 px-4 lg:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              isActive('/')
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            )}
          >
            All
          </Link>
          {/* Categories from API */}
          {categories?.map((category) => (
            <Link
              key={category._id || category.id}
              to={`/c/${category.slug}`}
              className={clsx(
                'flex-shrink-0 px-4 lg:px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive(`/c/${category.slug}`)
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
