import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
  Banknote,
  Check,
  ChevronRight,
  Shield,
  Lock,
} from 'lucide-react';
import { getProductsByIds } from '../api/endpoints';
import { useCartStore } from '../stores/cartStore';
import { useLocationStore } from '../stores/locationStore';
import { useOrdersStore } from '../stores/ordersStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatPrice } from '../utils/format';
import { clsx } from 'clsx';

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'netbanking' | 'cod';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, recommended: true },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'wallet', label: 'Wallets', icon: Wallet },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
  { id: 'cod', label: 'Pay on Delivery', icon: Banknote },
] as const;

const wallets = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'];
const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak'];

export function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [codConfirm, setCodConfirm] = useState(false);

  const { items, preferences, clearCart, calculateTotals } = useCartStore();
  const { getSelectedAddress } = useLocationStore();
  const { createOrder } = useOrdersStore();
  const { addToast } = useUIStore();

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

  const handlePayment = async () => {
    if (!selectedAddress) {
      addToast('Please select a delivery address', 'error');
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 2000));

    const orderId = createOrder(
      items,
      selectedAddress,
      totals.toPay,
      totals.totalSavings,
      totals.deliveryFee,
      totals.handlingFee,
      totals.tip,
      preferences.instructions,
      preferences.needBag
    );

    clearCart();
    addToast('Payment successful!', 'success');
    navigate(`/orders/${orderId}/success`);
  };

  const canPay = () => {
    switch (selectedMethod) {
      case 'upi':
        return upiId.includes('@');
      case 'card':
        return cardNumber.length >= 16 && cardExpiry.length === 5 && cardCvv.length === 3;
      case 'wallet':
        return !!selectedWallet;
      case 'netbanking':
        return !!selectedBank;
      case 'cod':
        return codConfirm;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          {['Cart', 'Address', 'Payment'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  index <= 2
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
                  {index < 2 ? <Check className="w-3 h-3" /> : index + 1}
                </span>
                {step}
              </div>
              {index < 2 && (
                <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Amount to Pay</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(totals.toPay)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:gap-6">
          <div className="lg:w-1/3 mb-4 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-100">
                Payment Methods
              </h3>
              <div className="divide-y divide-gray-100">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-4 transition-colors text-left',
                      selectedMethod === method.id
                        ? 'bg-violet-50 border-l-4 border-violet-600'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <method.icon
                      className={clsx(
                        'w-5 h-5',
                        selectedMethod === method.id
                          ? 'text-violet-600'
                          : 'text-gray-400'
                      )}
                    />
                    <div className="flex-1">
                      <span
                        className={clsx(
                          'font-medium',
                          selectedMethod === method.id
                            ? 'text-violet-700'
                            : 'text-gray-700'
                        )}
                      >
                        {method.label}
                      </span>
                      {method.recommended && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:flex-1">
            <motion.div
              key={selectedMethod}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              {selectedMethod === 'upi' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Pay via UPI</h3>
                  <Input
                    label="UPI ID"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    leftIcon={<Smartphone className="w-4 h-4" />}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your UPI ID linked with any UPI app
                  </p>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Card Details</h3>
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))
                    }
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) {
                          val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        }
                        setCardExpiry(val);
                      }}
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      type="password"
                      value={cardCvv}
                      onChange={(e) =>
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))
                      }
                      maxLength={3}
                      rightIcon={<Lock className="w-4 h-4" />}
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Select Wallet
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {wallets.map((wallet) => (
                      <button
                        key={wallet}
                        onClick={() => setSelectedWallet(wallet)}
                        className={clsx(
                          'p-4 rounded-lg border-2 text-left transition-colors',
                          selectedWallet === wallet
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <span className="font-medium text-gray-900">
                          {wallet}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Select Bank
                  </h3>
                  <div className="space-y-2">
                    {banks.map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={clsx(
                          'w-full p-4 rounded-lg border-2 text-left transition-colors flex items-center gap-3',
                          selectedBank === bank
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Landmark className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{bank}</span>
                        {selectedBank === bank && (
                          <Check className="w-5 h-5 text-violet-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedMethod === 'cod' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Pay on Delivery
                  </h3>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <p className="text-sm text-amber-800">
                      Please keep exact change ready. Our delivery partner may
                      not carry change.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codConfirm}
                      onChange={(e) => setCodConfirm(e.target.checked)}
                      className="mt-1 w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that I will pay {formatPrice(totals.toPay)} in
                      cash upon delivery
                    </span>
                  </label>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(totals.toPay)}
            </p>
          </div>
          <Button
            onClick={handlePayment}
            size="lg"
            loading={loading}
            disabled={!canPay()}
          >
            {selectedMethod === 'cod' ? 'Place Order' : `Pay ${formatPrice(totals.toPay)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
