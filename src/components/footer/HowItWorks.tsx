import { Smartphone, ShoppingCart, Zap } from 'lucide-react';

const steps = [
  {
    icon: Smartphone,
    title: 'Open the app',
    description: 'Choose from thousands of items across groceries, fruits & veggies, snacks, home needs and more.',
  },
  {
    icon: ShoppingCart,
    title: 'Place an order',
    description: 'Add your favourites to the cart and grab the best deals in seconds.',
  },
  {
    icon: Zap,
    title: 'Get free delivery',
    description: 'Lightning-fast delivery — get your essentials delivered in ~10 minutes.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8 lg:mb-12">
          How it Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
