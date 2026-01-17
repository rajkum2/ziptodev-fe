import { motion } from 'framer-motion';
import { Shield, FileText, RefreshCw } from 'lucide-react';

function PolicyLayout({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 md:p-8"
        >
          <div className="prose prose-gray max-w-none">{children}</div>
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Last updated: January 2024
        </p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" icon={Shield}>
      <p className="text-gray-600 mb-6">
        At Zipto, we are committed to protecting your privacy and ensuring the
        security of your personal information.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        1. Information We Collect
      </h2>
      <p className="text-gray-600 mb-4">
        We collect information you provide directly, including:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Name, email address, and phone number</li>
        <li>Delivery addresses</li>
        <li>Payment information (processed securely by our payment partners)</li>
        <li>Order history and preferences</li>
        <li>Device information and location data</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        2. How We Use Your Information
      </h2>
      <p className="text-gray-600 mb-4">We use your information to:</p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Process and deliver your orders</li>
        <li>Send order updates and delivery notifications</li>
        <li>Improve our services and user experience</li>
        <li>Provide customer support</li>
        <li>Send promotional offers (with your consent)</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        3. Data Security
      </h2>
      <p className="text-gray-600 mb-6">
        We implement industry-standard security measures to protect your data.
        All payment information is encrypted and processed through PCI-DSS
        compliant payment gateways.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        4. Data Sharing
      </h2>
      <p className="text-gray-600 mb-6">
        We do not sell your personal information. We may share data with
        delivery partners and payment processors solely to fulfill your orders.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        5. Your Rights
      </h2>
      <p className="text-gray-600 mb-4">You have the right to:</p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your account</li>
        <li>Opt-out of marketing communications</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        6. Contact Us
      </h2>
      <p className="text-gray-600">
        For privacy-related inquiries, contact us at:{' '}
        <a
          href="mailto:privacy@zipto.com"
          className="text-violet-600 hover:underline"
        >
          privacy@zipto.com
        </a>
      </p>
    </PolicyLayout>
  );
}

export function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" icon={FileText}>
      <p className="text-gray-600 mb-6">
        Welcome to Zipto. By using our services, you agree to these terms and
        conditions.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        1. Account Registration
      </h2>
      <p className="text-gray-600 mb-6">
        You must provide accurate information during registration. You are
        responsible for maintaining the confidentiality of your account
        credentials. One account per phone number is permitted.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        2. Orders and Delivery
      </h2>
      <p className="text-gray-600 mb-4">
        Order acceptance is subject to availability and serviceability.
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Orders can be cancelled within 2 minutes of placement</li>
        <li>Delivery times are estimates and may vary</li>
        <li>Someone must be available to receive the order</li>
        <li>We may refuse orders at our discretion</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        3. Pricing and Payment
      </h2>
      <p className="text-gray-600 mb-6">
        All prices include applicable taxes. We reserve the right to modify
        prices without notice. Payment must be made at the time of order or upon
        delivery (for COD orders).
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        4. Product Information
      </h2>
      <p className="text-gray-600 mb-6">
        We strive for accuracy in product descriptions and images. However,
        actual products may vary slightly. Product availability is subject to
        change without notice.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        5. Limitation of Liability
      </h2>
      <p className="text-gray-600 mb-6">
        Zipto shall not be liable for any indirect, incidental, or consequential
        damages. Our maximum liability is limited to the order value.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        6. Intellectual Property
      </h2>
      <p className="text-gray-600 mb-6">
        All content, trademarks, and intellectual property on our platform are
        owned by Zipto or its licensors. Unauthorized use is prohibited.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        7. Governing Law
      </h2>
      <p className="text-gray-600">
        These terms are governed by the laws of India. Any disputes shall be
        subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.
      </p>
    </PolicyLayout>
  );
}

export function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy" icon={RefreshCw}>
      <p className="text-gray-600 mb-6">
        We want you to be completely satisfied with every order. If there's an
        issue, we're here to help.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        1. Eligible for Refund
      </h2>
      <p className="text-gray-600 mb-4">You can request a refund for:</p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Damaged or broken products</li>
        <li>Expired products</li>
        <li>Wrong products delivered</li>
        <li>Missing items from your order</li>
        <li>Quality issues with fresh products</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        2. How to Request a Refund
      </h2>
      <p className="text-gray-600 mb-4">Follow these steps:</p>
      <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">
        <li>Go to My Orders and select the order</li>
        <li>Click on "Report Issue" for the affected item</li>
        <li>Select the issue type and upload photos if required</li>
        <li>Submit your request</li>
      </ol>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        3. Refund Timeline
      </h2>
      <p className="text-gray-600 mb-4">Refunds are processed as follows:</p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>
          <strong>UPI/Wallets:</strong> 1-2 business days
        </li>
        <li>
          <strong>Credit/Debit Cards:</strong> 5-7 business days
        </li>
        <li>
          <strong>Net Banking:</strong> 5-7 business days
        </li>
        <li>
          <strong>COD Orders:</strong> Credited to Zipto wallet instantly
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        4. Cancellation Refunds
      </h2>
      <p className="text-gray-600 mb-6">
        If you cancel within 2 minutes of placing the order, a full refund will
        be processed to your original payment method. Cancellation after this
        window is not possible as order preparation begins immediately.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        5. Non-Refundable Items
      </h2>
      <p className="text-gray-600 mb-4">
        The following are generally non-refundable:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
        <li>Items opened or used after delivery</li>
        <li>Items damaged due to mishandling by the customer</li>
        <li>Requests made after 24 hours of delivery</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        6. Contact for Refund Issues
      </h2>
      <p className="text-gray-600">
        If you face any issues with refunds, contact us at:{' '}
        <a
          href="mailto:support@zipto.com"
          className="text-violet-600 hover:underline"
        >
          support@zipto.com
        </a>{' '}
        or call 1800-123-4567.
      </p>
    </PolicyLayout>
  );
}
