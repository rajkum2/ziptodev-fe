import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ChevronRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { getProductsByIds } from '../api/endpoints';
import { useOrdersStore } from '../stores/ordersStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { formatPrice, formatDate } from '../utils/format';
import { clsx } from 'clsx';

const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  packing: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-violet-100 text-violet-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels = {
  placed: 'Placed',
  packing: 'Packing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export function OrdersPage() {
  const { orders } = useOrdersStore();
  const { addItem } = useCartStore();
  const { openCart, addToast, openModal } = useUIStore();
  const { isLoggedIn } = useAuthStore();

  const allProductIds = useMemo(() => {
    const ids = new Set<string>();
    orders.forEach((order) => {
      order.items.forEach((item) => ids.add(item.productId));
    });
    return Array.from(ids);
  }, [orders]);

  const { data: products } = useQuery({
    queryKey: ['orders-products', allProductIds],
    queryFn: () => getProductsByIds(allProductIds),
    enabled: allProductIds.length > 0,
  });

  const productMap = useMemo(() => {
    const map = new Map();
    products?.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      addItem(item.productId, item.variantId);
    });

    addToast('Items added to cart', 'success');
    openCart();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Please login to view orders
          </h2>
          <p className="text-gray-500 mb-4">
            Login to see your order history
          </p>
          <Button onClick={() => openModal('login')}>Login to Continue</Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-500 mb-4">
            Start shopping to see your orders here
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-gray-500">
                    {order.id}
                  </span>
                  <span
                    className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      statusColors[order.status]
                    )}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex -space-x-2 mb-3">
                  {order.items.slice(0, 4).map((item, i) => {
                    const product = productMap.get(item.productId);
                    if (!product) return null;
                    return (
                      <img
                        key={`${item.productId}_${i}`}
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg border-2 border-white object-cover"
                      />
                    );
                  })}
                  {order.items.length > 4 && (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                  items
                </p>

                <div className="flex gap-2">
                  <Link to={`/orders/${order.id}`} className="flex-1">
                    <Button variant="outline" fullWidth size="sm">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReorder(order.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reorder
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
