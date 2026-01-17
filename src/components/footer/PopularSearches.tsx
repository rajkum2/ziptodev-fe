import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/endpoints';
import footerData from '../../mockData/footerData.json';

export function PopularSearches() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
          Popular Searches
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Products</h3>
            <div className="flex flex-wrap gap-2">
              {footerData.popularSearches.products.map((product) => (
                <Link
                  key={product}
                  to={`/search?q=${encodeURIComponent(product)}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {product}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {footerData.popularSearches.brands.map((brand) => (
                <Link
                  key={brand}
                  to={`/search?q=${encodeURIComponent(brand)}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Link
                  key={category._id || category.id}
                  to={`/c/${category.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
