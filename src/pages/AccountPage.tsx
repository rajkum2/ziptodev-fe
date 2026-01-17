import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Package,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Plus,
  Home,
  Briefcase,
  MapPinned,
  Trash2,
  Phone,
  FileText,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLocationStore } from '../stores/locationStore';
import { useUIStore } from '../stores/uiStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { formatPhoneNumber } from '../utils/format';
import { clsx } from 'clsx';

const labelIcons = {
  home: Home,
  work: Briefcase,
  other: MapPinned,
};

export function AccountPage() {
  const { isLoggedIn, user, logout, updateProfile } = useAuthStore();
  const { addresses, deleteAddress } = useLocationStore();
  const { openModal, addToast } = useUIStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  const handleSaveName = () => {
    updateProfile(editName);
    setIsEditingName(false);
    addToast('Profile updated', 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    addToast('Address deleted', 'info');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Zipto
          </h1>
          <p className="text-gray-500 mb-6">
            Login to manage your account, addresses, and orders
          </p>
          <Button onClick={() => openModal('login')} fullWidth size="lg">
            Login to Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-violet-600" />
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleSaveName} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingName(false)}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {user?.name || 'Add your name'}
                    </h2>
                    <button
                      onClick={() => {
                        setEditName(user?.name || '');
                        setIsEditingName(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user?.phone ? formatPhoneNumber(user.phone) : 'No phone'}
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-900">My Addresses</span>
            </div>
            <button
              onClick={() => openModal('addAddress')}
              className="flex items-center gap-1 text-sm text-violet-600 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
          {addresses.length === 0 ? (
            <div className="p-6 text-center">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No saved addresses</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {addresses.map((address) => {
                const Icon = labelIcons[address.label];
                return (
                  <div
                    key={address.id}
                    className="p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 capitalize">
                          {address.label}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                        {address.landmark && `, near ${address.landmark}`}
                        , {address.city} - {address.pincode}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.name} - {address.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <Link
            to="/orders"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <Package className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">My Orders</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="border-t border-gray-100" />
          <Link
            to="/help"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">
              Help & Support
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="border-t border-gray-100" />
          <Link
            to="/terms"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">
              Terms & Conditions
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="border-t border-gray-100" />
          <Link
            to="/privacy"
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="flex-1 font-medium text-gray-700">
              Privacy Policy
            </span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </Link>
          <div className="border-t border-gray-100" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="flex-1 font-medium text-red-600">Logout</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
