import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/endpoints';

export function FooterCategories() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <section className="bg-gray-50 py-12 lg:py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
          Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories?.map((category) => (
            <Link
              key={category._id || category.id}
              to={`/c/${category.slug}`}
              className="text-sm text-gray-700 hover:text-green-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
