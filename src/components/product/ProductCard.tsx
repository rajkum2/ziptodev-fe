import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuantityStepper } from '../ui/QuantityStepper';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { formatPrice, formatDiscount } from '../../utils/format';
import type { Product, ProductImage } from '../../types';
import { clsx } from 'clsx';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
}

// Helper to get image URL from string or ProductImage object
function getImageUrl(image: string | ProductImage): string {
  return typeof image === 'string' ? image : image.url;
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const { addToast } = useUIStore();

  const selectedVariant = product.variants[0];
  const productId = product._id || product.id || '';
  const variantId = selectedVariant._id || selectedVariant.id || selectedVariant.variantId || '';
  const quantity = getItemQuantity(productId, variantId);
  const discount = formatDiscount(selectedVariant.mrp, selectedVariant.price);
  const imageUrl = product.images[0] ? getImageUrl(product.images[0]) : '';

  const handleAdd = () => {
    addItem(productId, variantId);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleIncrement = () => {
    addItem(productId, variantId);
  };

  const handleDecrement = () => {
    updateQuantity(productId, variantId, quantity - 1);
    if (quantity === 1) {
      addToast(`${product.name} removed from cart`, 'info');
    }
  };

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/p/${product.slug}`}
        className="flex gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative w-20 h-20 shrink-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {discount > 0 && (
            <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{selectedVariant.name}</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">
                {formatPrice(selectedVariant.price)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  {formatPrice(selectedVariant.mrp)}
                </span>
              )}
            </div>
            <QuantityStepper
              quantity={quantity}
              onAdd={handleAdd}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              size="sm"
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={clsx(
        'bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden',
        variant === 'compact' ? 'p-2' : 'p-3'
      )}
    >
      <Link to={`/p/${product.slug}`} className="block">
        <div className="relative aspect-square mb-2">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute top-1 left-1 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
          {product.tags?.includes('bestseller') && (
            <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs font-medium px-1.5 py-0.5 rounded">
              Bestseller
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-0.5 truncate">{product.brand}</p>
        <h3
          className={clsx(
            'font-medium text-gray-900 line-clamp-2 mb-1',
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{selectedVariant.name}</p>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <span
            className={clsx(
              'font-bold text-gray-900',
              variant === 'compact' ? 'text-sm' : ''
            )}
          >
            {formatPrice(selectedVariant.price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through ml-1">
              {formatPrice(selectedVariant.mrp)}
            </span>
          )}
        </div>
        <QuantityStepper
          quantity={quantity}
          onAdd={handleAdd}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          size={variant === 'compact' ? 'sm' : 'md'}
        />
      </div>
    </motion.div>
  );
}
