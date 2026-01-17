import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  Clock,
  Package,
  CreditCard,
  RefreshCw,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { clsx } from 'clsx';

const faqs = [
  {
    category: 'Orders',
    icon: ShoppingBag,
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse products, add items to cart, select delivery address, choose payment method, and confirm your order. Your order will be delivered within 10-15 minutes.',
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'Once an order is placed, modifications are not possible as we start preparing it immediately. However, you can cancel within 2 minutes of placing the order.',
      },
      {
        q: 'What if an item is out of stock?',
        a: 'If an item becomes unavailable after you place an order, we will notify you and automatically refund the amount for that item.',
      },
    ],
  },
  {
    category: 'Delivery',
    icon: Package,
    questions: [
      {
        q: 'What is the delivery time?',
        a: 'We deliver within 10-15 minutes of order confirmation in serviceable areas. Delivery time may vary based on traffic and weather conditions.',
      },
      {
        q: 'Is there a minimum order value?',
        a: 'There is no minimum order value. However, orders below Rs 99 will have a delivery fee of Rs 30.',
      },
      {
        q: 'What areas do you deliver to?',
        a: 'We currently deliver to select areas in major cities. Enter your pincode to check serviceability in your area.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe, Amazon Pay), and Cash on Delivery.',
      },
      {
        q: 'Is it safe to save my card?',
        a: 'Yes, we use industry-standard encryption and are PCI-DSS compliant. Your card details are securely stored with our payment partner.',
      },
      {
        q: 'How do refunds work?',
        a: 'Refunds are processed to the original payment method within 5-7 business days. For COD orders, refunds are credited to your Zipto wallet.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: RefreshCw,
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer no-questions-asked returns for damaged, expired, or wrong products. Report issues within 24 hours of delivery.',
      },
      {
        q: 'How do I report a damaged product?',
        a: 'Go to Orders > Select Order > Report Issue. Take photos of the damaged product and submit. We will process replacement or refund immediately.',
      },
    ],
  },
  {
    category: 'Account',
    icon: MapPin,
    questions: [
      {
        q: 'How do I add/change delivery address?',
        a: 'Go to Account > Addresses > Add New Address. You can also change address during checkout before payment.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Contact our support team via email or phone. Account deletion requests are processed within 48 hours.',
      },
    ],
  },
];

export function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            How can we help?
          </h1>
          <p className="text-gray-500">
            Find answers to common questions or contact our support team
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Phone className="w-8 h-8 text-violet-600" />
            <span className="font-semibold text-gray-900">Call Us</span>
            <span className="text-sm text-gray-500">1800-123-4567</span>
          </a>
          <a
            href="mailto:support@zipto.com"
            className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Mail className="w-8 h-8 text-violet-600" />
            <span className="font-semibold text-gray-900">Email Us</span>
            <span className="text-sm text-gray-500">support@zipto.com</span>
          </a>
          <div className="flex flex-col items-center gap-2 p-6 bg-white rounded-xl shadow-sm">
            <Clock className="w-8 h-8 text-violet-600" />
            <span className="font-semibold text-gray-900">Support Hours</span>
            <span className="text-sm text-gray-500">24/7 Available</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((category, catIndex) => (
              <div
                key={category.category}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
                  <category.icon className="w-5 h-5 text-violet-600" />
                  <span className="font-semibold text-gray-900">
                    {category.category}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.questions.map((faq, faqIndex) => {
                    const id = `${catIndex}-${faqIndex}`;
                    const isExpanded = expandedFaq === id;
                    return (
                      <div key={id}>
                        <button
                          onClick={() => toggleFaq(id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={clsx(
                              'w-5 h-5 text-gray-400 shrink-0 transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-violet-50 rounded-xl text-center"
        >
          <MessageCircle className="w-10 h-10 text-violet-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you 24/7
          </p>
          <a
            href="mailto:support@zipto.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
