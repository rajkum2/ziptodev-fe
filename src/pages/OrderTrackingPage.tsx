import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Package,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  HelpCircle,
  Truck,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { getProductsByIds } from '../api/endpoints';
import { useOrdersStore } from '../stores/ordersStore';
import { Button } from '../components/ui/Button';
import { formatPrice, formatDate, formatTime } from '../utils/format';
import { clsx } from 'clsx';

const statusSteps = [
  { id: 'placed', label: 'Order Placed', icon: ShoppingBag },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder, updateOrderStatus } = useOrdersStore();
  const [, setTick] = useState(0);

  const order = orderId ? getOrder(orderId) : null;

  const productIds = order?.items.map((item) => item.productId) || [];
  const { data: products } = useQuery({
    queryKey: ['order-products', productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: productIds.length > 0,
  });

  const productMap = useMemo(() => {
    const map = new Map();
    products?.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  useEffect(() => {
    if (!order || !orderId) return;

    const statusOrder = ['placed', 'packing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);

    if (currentIndex < statusOrder.length - 1) {
      const timer = setInterval(() => {
        const updatedOrder = getOrder(orderId);
        if (!updatedOrder) return;

        const idx = statusOrder.indexOf(updatedOrder.status);
        if (idx < statusOrder.length - 1) {
          updateOrderStatus(orderId, statusOrder[idx + 1] as typeof order.status);
          setTick((t) => t + 1);
        } else {
          clearInterval(timer);
        }
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [order?.status, orderId, getOrder, updateOrderStatus]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order not found
          </h2>
          <Link to="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.id === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-semibold text-gray-900">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Placed on</p>
              <p className="font-medium text-gray-900">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center gap-4 pb-8 last:pb-0"
                >
                  <div
                    className={clsx(
                      'relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      isCompleted
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-violet-500 animate-pulse'
                        : 'bg-gray-200'
                    )}
                  >
                    <step.icon
                      className={clsx(
                        'w-5 h-5',
                        isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={clsx(
                        'font-semibold',
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-400'
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && order.status !== 'delivered' && (
                      <p className="text-sm text-violet-600">In progress...</p>
                    )}
                    {step.id === 'delivered' && isCompleted && (
                      <p className="text-sm text-green-600">
                        Order has been delivered
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {order.status !== 'delivered' && (
            <div className="mt-6 p-4 bg-violet-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-violet-600" />
                <div>
                  <p className="font-semibold text-violet-700">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-violet-600">In 8-10 minutes</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
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
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="font-semibold text-gray-900">Total Paid</span>
            <span className="font-bold text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {order.address.label}
              </p>
              <p className="text-sm text-gray-600">
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
                {order.address.landmark && `, near ${order.address.landmark}`}
              </p>
              <p className="text-sm text-gray-600">
                {order.address.city} - {order.address.pincode}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {order.address.name} - {order.address.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Link
            to="/help"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">Need Help?</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="border-t border-gray-100" />
          <a
            href="tel:+919876543210"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">
              Contact Support
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </a>
        </div>
      </div>
    </div>
  );
}
