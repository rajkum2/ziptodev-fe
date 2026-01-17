import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Clock, MapPin } from 'lucide-react';
import { useOrdersStore } from '../stores/ordersStore';
import { useLocationStore } from '../stores/locationStore';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/format';

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrdersStore();
  const { etaText } = useLocationStore();

  const order = orderId ? getOrder(orderId) : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order not found
          </h2>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-6">
            Thank you for your order. We're preparing it for delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-mono font-semibold text-gray-900">
              {order.id}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(order.total)}
            </span>
          </div>
          {order.savings > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="text-sm">You Saved</span>
              <span className="font-semibold">{formatPrice(order.savings)}</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl mb-6"
        >
          <Clock className="w-6 h-6 text-violet-600" />
          <div className="text-left">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-semibold text-violet-700">{etaText}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl mb-6 text-left"
        >
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">Delivering to</p>
            <p className="font-medium text-gray-900 capitalize">
              {order.address.label}
            </p>
            <p className="text-sm text-gray-600">
              {order.address.line1}, {order.address.city}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Link to={`/orders/${order.id}`}>
            <Button fullWidth>Track Order</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" fullWidth>
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
