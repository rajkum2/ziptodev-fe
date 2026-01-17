import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Shield,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { getProductBySlug, getRecommendations } from '../api/endpoints';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton, ProductGridSkeleton } from '../components/ui/Skeleton';
import { HowItWorks } from '../components/footer/HowItWorks';
import { PopularSearches } from '../components/footer/PopularSearches';
import { FooterCategories } from '../components/footer/FooterCategories';
import { SiteFooter } from '../components/footer/SiteFooter';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { useLocationStore } from '../stores/locationStore';
import { formatPrice, formatDiscount } from '../utils/format';
import { clsx } from 'clsx';
import type { ProductImage } from '../types';

// Helper to get image URL from string or ProductImage object
function getImageUrl(image: string | ProductImage): string {
  return typeof image === 'string' ? image : image.url;
}

export function ProductPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('highlights');
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const { addToast } = useUIStore();
  const { etaText } = useLocationStore();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => getProductBySlug(productSlug!),
    enabled: !!productSlug,
  });

  const productId = product?._id || product?.id || '';

  const { data: recommendations, isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => getRecommendations(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    setSelectedVariantIndex(0);
    setCurrentImageIndex(0);
  }, [productSlug]);

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-1/2">
              <Skeleton className="w-full aspect-square rounded-xl mb-4" />
            </div>
            <div className="lg:w-1/2">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-32 mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-500 mb-4">
            The product you're looking for doesn't exist
          </p>
          <Link
            to="/"
            className="text-green-600 hover:underline font-medium"
          >
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const discount = formatDiscount(selectedVariant.mrp, selectedVariant.price);
  const pId = product._id || product.id || '';
  const vId = selectedVariant._id || selectedVariant.id || selectedVariant.variantId || '';
  const quantity = getItemQuantity(pId, vId);

  const handleAdd = () => {
    addItem(pId, vId);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleIncrement = () => {
    addItem(pId, vId);
  };

  const handleDecrement = () => {
    updateQuantity(pId, vId, quantity - 1);
    if (quantity === 1) {
      addToast(`${product.name} removed from cart`, 'info');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-1/2 mb-6 lg:mb-0">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative aspect-square">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={getImageUrl(product.images[currentImageIndex])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {discount}% OFF
                  </span>
                )}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (currentImageIndex - 1 + product.images.length) %
                            product.images.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (currentImageIndex + 1) % product.images.length
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={clsx(
                        'w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                        index === currentImageIndex
                          ? 'border-green-500'
                          : 'border-transparent'
                      )}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {product.variants.length > 1 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant._id || variant.id || variant.variantId || index}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={clsx(
                          'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors',
                          index === selectedVariantIndex
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        )}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(selectedVariant.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(selectedVariant.mrp)}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Delivery in {etaText}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Free delivery on orders above Rs 99
                </span>
              </div>

              <div className="mb-6">
                <QuantityStepper
                  quantity={quantity}
                  onAdd={handleAdd}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  size="md"
                />
              </div>

              <div className="space-y-2">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('highlights')}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      Highlights
                    </span>
                    <ChevronDown
                      className={clsx(
                        'w-5 h-5 text-gray-400 transition-transform',
                        expandedSection === 'highlights' && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedSection === 'highlights' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4"
                    >
                      <div className="space-y-2">
                        {Object.entries(product.highlights || {}).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                            >
                              <span className="text-sm text-gray-500">{key}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('description')}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      Product Information
                    </span>
                    <ChevronDown
                      className={clsx(
                        'w-5 h-5 text-gray-400 transition-transform',
                        expandedSection === 'description' && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedSection === 'description' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('compliance')}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        Seller & Compliance
                      </span>
                    </div>
                    <ChevronDown
                      className={clsx(
                        'w-5 h-5 text-gray-400 transition-transform',
                        expandedSection === 'compliance' && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedSection === 'compliance' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4"
                    >
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Seller: </span>
                          <span className="text-gray-900">
                            {product.compliance?.seller}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">Address: </span>
                          <span className="text-gray-900">
                            {product.compliance?.address}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">FSSAI: </span>
                          <span className="text-gray-900">
                            {product.compliance?.fssai}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              You may also like
            </h2>
            {recsLoading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recommendations.slice(0, 6).map((rec) => (
                  <ProductCard key={rec._id || rec.id} product={rec} />
                ))}
              </div>
            )}
          </section>
        )}
        </div>
      </div>

      <HowItWorks />
      <PopularSearches />
      <FooterCategories />
      <SiteFooter />
    </>
  );
}
