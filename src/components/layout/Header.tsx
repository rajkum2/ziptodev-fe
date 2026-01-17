import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  User,
  ShoppingBag,
  ChevronDown,
  Zap,
  Menu,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useLocationStore } from '../../stores/locationStore';

export function Header() {
  const navigate = useNavigate();
  const { openCart, openModal, openSearch, toggleSidebar } = useUIStore();
  const { isLoggedIn } = useAuthStore();
  const { items } = useCartStore();
  const { selectedLocation, etaText } = useLocationStore();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/account');
    } else {
      openModal('login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Zipto
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  Get everything in 10 min
                </p>
              </div>
            </Link>
          </div>

          <button
            onClick={() => openModal('location')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MapPin className="w-4 h-4 text-violet-600" />
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {selectedLocation?.area?.split(',')[0] || 'Select Location'}
              </p>
              <p className="text-xs text-gray-500">{etaText}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <button
              onClick={openSearch}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
            >
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Search for products...</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={handleProfileClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
              <span className="hidden sm:inline text-sm font-semibold">
                Cart
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
