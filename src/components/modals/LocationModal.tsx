import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Home, Briefcase, Navigation } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/uiStore';
import { useLocationStore } from '../../stores/locationStore';
import { checkServiceability } from '../../api/endpoints';

const quickPicks = [
  { icon: Home, label: 'Home', pincode: '400001' },
  { icon: Briefcase, label: 'Work', pincode: '400002' },
];

export function LocationModal() {
  const { activeModal, closeModal, addToast } = useUIStore();
  const { setLocation, selectedLocation } = useLocationStore();
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isOpen = activeModal === 'location';

  const handleSearch = async () => {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await checkServiceability(pincode);
      if (result.isServiceable) {
        setLocation(result);
        addToast(`Delivery available to ${result.area}`, 'success');
        closeModal();
      } else {
        setError('Sorry, we do not deliver to this area yet');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPick = async (pin: string, label: string) => {
    setLoading(true);
    try {
      const result = await checkServiceability(pin);
      if (result.isServiceable) {
        setLocation({ ...result, area: `${label}, ${result.area}` });
        addToast(`Delivery available to ${label}`, 'success');
        closeModal();
      }
    } catch {
      addToast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    handleQuickPick('400001', 'Current Location');
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Delivering to" size="sm">
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            leftIcon={<Search className="w-4 h-4" />}
            error={error}
            maxLength={6}
          />
          <Button onClick={handleSearch} loading={loading} disabled={pincode.length !== 6}>
            Check
          </Button>
        </div>

        {selectedLocation && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                Currently delivering to: {selectedLocation.area}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Quick picks</p>
          <div className="grid grid-cols-2 gap-3">
            {quickPicks.map((pick) => (
              <motion.button
                key={pick.label}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickPick(pick.pincode, pick.label)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <pick.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">{pick.label}</span>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCurrentLocation}
            className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-colors"
          >
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-violet-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Use current location</p>
              <p className="text-xs text-gray-500">
                Enable location access for auto-detect
              </p>
            </div>
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
