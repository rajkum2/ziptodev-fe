import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin,
  ChevronRight,
  ShoppingBag,
  Clock,
  Tag,
  Edit2,
  Leaf,
  MessageSquare,
  HandCoins,
} from 'lucide-react';
import { getProductsByIds } from '../api/endpoints';
import { useCartStore } from '../stores/cartStore';
import { useLocationStore } from '../stores/locationStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/format';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const { items, preferences, calculateTotals } = useCartStore();
  const { getSelectedAddress, etaText } = useLocationStore();
  const { openModal } = useUIStore();

  const selectedAddress = getSelectedAddress();

  const productIds = items.map((item) => item.productId);
  const { data: products } = useQuery({
    queryKey: ['cart-products', productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: productIds.length > 0,
  });

  const productMap = useMemo(() => {
    const map = new Map();
    products?.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const priceMap = useMemo(() => {
    const map = new Map<string, { mrp: number; price: number }>();
    items.forEach((item) => {
      const product = productMap.get(item.productId);
      const variant = product?.variants.find((v: { id: string }) => v.id === item.variantId);
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please login to continue
          </h2>
          <p className="text-gray-500 mb-4">
            You need to be logged in to checkout
          </p>
          <Button onClick={() => openModal('login')}>Login to Continue</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-4">
            Add items to your cart to checkout
          </p>
          <Link to="/">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          {['Cart', 'Address', 'Payment'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  index <= 1
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {step}
              </div>
              {index < 2 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-violet-600" />
                <span className="font-semibold text-gray-900">
                  Delivery Address
                </span>
              </div>
              <button
                onClick={() => openModal('address')}
                className="flex items-center gap-1 text-sm text-violet-600 hover:underline"
              >
                <Edit2 className="w-4 h-4" />
                Change
              </button>
            </div>
            {selectedAddress ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 capitalize mb-1">
                  {selectedAddress.label}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedAddress.line1}
                  {selectedAddress.line2 && `, ${selectedAddress.line2}`}
                  {selectedAddress.landmark && `, near ${selectedAddress.landmark}`}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedAddress.city} - {selectedAddress.pincode}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAddress.name} - {selectedAddress.phone}
                </p>
              </div>
            ) : (
              <button
                onClick={() => openModal('address')}
                className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-violet-300 transition-colors"
              >
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Add delivery address</p>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-violet-600" />
              <span className="font-semibold text-gray-900">
                Delivery in {etaText}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">
                Order Summary ({totals.itemCount} items)
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const product = productMap.get(item.productId);
                const variant = product?.variants.find(
                  (v: { id: string }) => v.id === item.variantId
                );
                if (!product || !variant) return null;

                return (
                  <div
                    key={`${item.productId}_${item.variantId}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {variant.name} x {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(variant.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Bill Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Total</span>
                <span className="text-gray-900">
                  {formatPrice(totals.itemTotalSelling)}
                </span>
              </div>
              {totals.discountOnMrp > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount on MRP</span>
                  <span>-{formatPrice(totals.discountOnMrp)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span
                  className={
                    totals.deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'
                  }
                >
                  {totals.deliveryFee === 0
                    ? 'FREE'
                    : formatPrice(totals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Handling Fee</span>
                <span
                  className={
                    totals.handlingFee === 0 ? 'text-green-600' : 'text-gray-900'
                  }
                >
                  {totals.handlingFee === 0
                    ? 'FREE'
                    : formatPrice(totals.handlingFee)}
                </span>
              </div>
              {totals.tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip</span>
                  <span className="text-gray-900">{formatPrice(totals.tip)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between font-semibold text-base">
                <span>To Pay</span>
                <span>{formatPrice(totals.toPay)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
            <div className="space-y-2 text-sm">
              {preferences.instructions && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Instructions:</p>
                    <p className="text-gray-900">{preferences.instructions}</p>
                  </div>
                </div>
              )}
              {preferences.tip > 0 && (
                <div className="flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Tip: {formatPrice(preferences.tip)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">
                  {preferences.needBag
                    ? 'Paper bag requested'
                    : 'No paper bag (eco-friendly)'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <Tag className="w-5 h-5" />
              <span className="font-semibold">
                Total Savings: {formatPrice(totals.totalSavings)}
              </span>
            </div>
          </div>

          {user && (
            <div className="text-sm text-gray-500 text-center">
              Ordering for: {user.name || user.phone}
            </div>
          )}
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={() => navigate('/payment')}
            fullWidth
            size="lg"
            disabled={!selectedAddress}
          >
            Proceed to Payment - {formatPrice(totals.toPay)}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
