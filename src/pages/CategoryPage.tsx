import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory } from '../api/endpoints';
import { CategorySidebar } from '../components/layout/CategorySidebar';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { HowItWorks } from '../components/footer/HowItWorks';
import { PopularSearches } from '../components/footer/PopularSearches';
import { FooterCategories } from '../components/footer/FooterCategories';
import { SiteFooter } from '../components/footer/SiteFooter';
import { clsx } from 'clsx';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'bestseller', label: 'Best Sellers' },
  { id: 'under99', label: 'Under Rs 99' },
  { id: 'new', label: 'New' },
];

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [activeTab, setActiveTab] = useState('all');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: () => getCategoryBySlug(categorySlug!),
    enabled: !!categorySlug,
  });

  const {
    data: products,
    isLoading: productsLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category-products', categorySlug],
    queryFn: () => getProductsByCategory(categorySlug!),
    enabled: !!categorySlug,
  });

  const filteredProducts = products?.filter((p) => {
    if (activeTab === 'all') return true;
    return p.tags?.includes(activeTab);
  });

  const isLoading = categoryLoading || productsLoading;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6">
            {isDesktop && <CategorySidebar />}

            <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {category?.name || 'Loading...'}
              </h1>
              {products && (
                <p className="text-sm text-gray-500">
                  {filteredProducts?.length} products found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {tab.label}
                </button>
              ))}
              <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full text-sm font-medium whitespace-nowrap ml-auto">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full text-sm font-medium whitespace-nowrap">
                Sort
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {category && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div
                  className="col-span-2 md:col-span-3 p-4 rounded-xl"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="font-bold text-gray-900 text-lg">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Fresh products delivered in 10 minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load products
                </h3>
                <p className="text-gray-500 mb-4">
                  Something went wrong. Please try again.
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try changing the filters or browse other categories
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filteredProducts?.map((product, index) => (
                  <motion.div
                    key={product._id || product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            </main>
          </div>
        </div>
      </div>

      <HowItWorks />
      <PopularSearches />
      <FooterCategories />
      <SiteFooter />
    </>
  );
}
