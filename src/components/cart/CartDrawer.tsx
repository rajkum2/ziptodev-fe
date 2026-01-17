import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  MapPin,
  Clock,
  Tag,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Info,
  Leaf,
  Truck,
  HandCoins,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useLocationStore } from '../../stores/locationStore';
import { getProductsByIds } from '../../api/endpoints';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/format';
import { clsx } from 'clsx';
import type { Product } from '../../types';

export function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, closeCart, openModal, addToast } = useUIStore();
  const { isLoggedIn } = useAuthStore();
  const {
    items,
    preferences,
    noFeesActive,
    updateQuantity,
    removeItem,
    setTip,
    setInstructions,
    setNeedBag,
    calculateTotals,
  } = useCartStore();
  const { etaText, addresses, selectedAddressId, getSelectedAddress } = useLocationStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const productIds = items.map((item) => item.productId);
  const { data: products } = useQuery({
    queryKey: ['cart-products', productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: productIds.length > 0,
  });

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products?.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const priceMap = useMemo(() => {
    const map = new Map<string, { mrp: number; price: number }>();
    items.forEach((item) => {
      const product = productMap.get(item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (variant) {
        map.set(`${item.productId}_${item.variantId}`, {
          mrp: variant.mrp,
          price: variant.price,
        });
      }
    });
    return map;
  }, [items, productMap]);

  const totals = calculateTotals(priceMap);
  const selectedAddress = getSelectedAddress();

  const handleCheckout = () => {
    if (!selectedAddress) {
      openModal('address');
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  const handleClose = () => {
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/50"
      >
        <motion.div
          initial={isMobile ? { y: '100%' } : { x: '100%' }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: '100%' } : { x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'absolute bg-white flex flex-col',
            isMobile
              ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[95vh]'
              : 'right-0 top-0 bottom-0 w-full max-w-md'
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
              <span className="text-sm text-gray-500">({totals.itemCount} items)</span>
            </div>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Please login to access cart
                </h3>
                <p className="text-gray-500 mb-6">
                  Login to view your cart items and checkout
                </p>
                <Button onClick={() => openModal('login')}>Login to Continue</Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Start adding items to your cart
                </p>
                <Button onClick={handleClose}>Start Shopping</Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {totals.totalSavings > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl"
                  >
                    <Tag className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-700">
                      Yay! You saved {formatPrice(totals.totalSavings)} on this order
                    </p>
                  </motion.div>
                )}

                {noFeesActive && (
                  <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-xl">
                    <HandCoins className="w-5 h-5 text-violet-600" />
                    <div>
                      <p className="text-sm font-medium text-violet-700">No Fees Applied</p>
                      <p className="text-xs text-violet-600">
                        Enjoy free delivery & no handling charges
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Delivery in {etaText}
                  </p>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const product = productMap.get(item.productId);
                    const variant = product?.variants.find((v) => v.id === item.variantId);
                    if (!product || !variant) return null;

                    return (
                      <div
                        key={`${item.productId}_${item.variantId}`}
                        className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500">{variant.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold text-gray-900">
                              {formatPrice(variant.price)}
                            </span>
                            {variant.mrp > variant.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(variant.mrp)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => {
                              removeItem(item.productId, item.variantId);
                              addToast(`${product.name} removed`, 'info');
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-1 bg-violet-600 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity - 1
                                )
                              }
                              className="p-1.5 text-white hover:bg-violet-700 rounded-l-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity + 1
                                )
                              }
                              className="p-1.5 text-white hover:bg-violet-700 rounded-r-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <h4 className="font-semibold text-gray-900">Bill Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Total (MRP)</span>
                      <span className="text-gray-400 line-through">
                        {formatPrice(totals.itemTotalMrp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Item Total</span>
                      <span className="text-gray-900">{formatPrice(totals.itemTotalSelling)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount on MRP</span>
                      <span>-{formatPrice(totals.discountOnMrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span
                        className={
                          totals.deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'
                        }
                      >
                        {totals.deliveryFee === 0 ? 'FREE' : formatPrice(totals.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Handling Fee</span>
                      <span
                        className={
                          totals.handlingFee === 0 ? 'text-green-600' : 'text-gray-900'
                        }
                      >
                        {totals.handlingFee === 0 ? 'FREE' : formatPrice(totals.handlingFee)}
                      </span>
                    </div>
                    {totals.tip > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tip</span>
                        <span className="text-gray-900">{formatPrice(totals.tip)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold text-base">
                      <span>To Pay</span>
                      <span>{formatPrice(totals.toPay)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <details className="group">
                    <summary className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Delivery Instructions
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                      <textarea
                        value={preferences.instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="E.g., Leave at door, call before delivery..."
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </details>

                  <details className="group">
                    <summary className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-2">
                        <HandCoins className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Tip your delivery partner
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                      <div className="flex gap-2">
                        {[0, 10, 20, 30, 50].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setTip(amount)}
                            className={clsx(
                              'flex-1 py-2 text-sm font-medium rounded-lg border-2 transition-colors',
                              preferences.tip === amount
                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            )}
                          >
                            {amount === 0 ? 'No tip' : `₹${amount}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </details>

                  <button
                    onClick={() => setNeedBag(!preferences.needBag)}
                    className="flex items-center gap-3 w-full p-3 bg-white border border-gray-100 rounded-xl"
                  >
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="flex-1 text-left text-sm font-medium text-gray-900">
                      I don't need a paper bag
                    </span>
                    <div
                      className={clsx(
                        'w-10 h-6 rounded-full transition-colors',
                        !preferences.needBag ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    >
                      <div
                        className={clsx(
                          'w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5',
                          !preferences.needBag ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'
                        )}
                      />
                    </div>
                  </button>

                  <details className="group">
                    <summary className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Safety & Hygiene
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>- All delivery partners wear masks</li>
                        <li>- Contactless delivery available</li>
                        <li>- Packages sanitized before delivery</li>
                        <li>- Temperature checks for all staff</li>
                      </ul>
                    </div>
                  </details>
                </div>

                {selectedAddress && (
                  <button
                    onClick={() => openModal('address')}
                    className="flex items-center gap-3 w-full p-3 bg-white border border-gray-100 rounded-xl"
                  >
                    <MapPin className="w-5 h-5 text-violet-600" />
                    <div className="flex-1 text-left">
                      <p className="text-xs text-gray-500">Delivering to</p>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {selectedAddress.label} - {selectedAddress.line1}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {isLoggedIn && items.length > 0 && (
            <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
              <Button onClick={handleCheckout} fullWidth size="lg">
                {selectedAddress ? (
                  <>
                    Click to Pay {formatPrice(totals.toPay)}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5 mr-2" />
                    Add Address to Proceed
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
