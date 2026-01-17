import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Home, Briefcase, MapPinned, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useUIStore } from '../../stores/uiStore';
import { useLocationStore } from '../../stores/locationStore';
import type { Address } from '../../types';
import { clsx } from 'clsx';

const labelIcons = {
  home: Home,
  work: Briefcase,
  other: MapPinned,
};

export function AddressModal() {
  const { activeModal, closeModal, openModal, addToast } = useUIStore();
  const { addresses, selectedAddressId, selectAddress } = useLocationStore();

  const isOpen = activeModal === 'address';

  const handleSelect = (id: string) => {
    selectAddress(id);
    addToast('Delivery address updated', 'success');
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Select an Address" size="md">
      <div className="p-4">
        <Button
          variant="outline"
          fullWidth
          onClick={() => openModal('addAddress')}
          className="mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No saved addresses</p>
            <p className="text-sm text-gray-400">Add an address to continue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => {
              const Icon = labelIcons[address.label];
              const isSelected = selectedAddressId === address.id;

              return (
                <motion.button
                  key={address.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(address.id)}
                  className={clsx(
                    'w-full p-4 rounded-xl border-2 text-left transition-colors',
                    isSelected
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        isSelected ? 'bg-violet-100' : 'bg-gray-100'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'w-5 h-5',
                          isSelected ? 'text-violet-600' : 'text-gray-600'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 capitalize">
                          {address.label}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {address.line1}, {address.line2 && `${address.line2}, `}
                        {address.landmark && `near ${address.landmark}, `}
                        {address.city} - {address.pincode}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {address.name} - {address.phone}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function AddAddressModal() {
  const { activeModal, closeModal, openModal, addToast } = useUIStore();
  const { addAddress } = useLocationStore();

  const isOpen = activeModal === 'addAddress';

  const [form, setForm] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: 'home',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(form);
    addToast('Address saved successfully', 'success');
    setForm({
      label: 'home',
      name: '',
      phone: '',
      line1: '',
      line2: '',
      landmark: '',
      pincode: '',
      city: '',
    });
    openModal('address');
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => openModal('address')} title="Add New Address" size="md">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Save as</p>
          <div className="flex gap-2">
            {(['home', 'work', 'other'] as const).map((label) => {
              const Icon = labelIcons[label];
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => updateField('label', label)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border-2 capitalize transition-colors',
                    form.label === label
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Receiver Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) =>
              updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
            }
            required
          />
        </div>

        <Input
          label="Address Line 1"
          placeholder="Flat / House No., Building Name"
          value={form.line1}
          onChange={(e) => updateField('line1', e.target.value)}
          required
        />

        <Input
          label="Address Line 2"
          placeholder="Street, Area (Optional)"
          value={form.line2}
          onChange={(e) => updateField('line2', e.target.value)}
        />

        <Input
          label="Landmark"
          placeholder="Near temple, school, etc. (Optional)"
          value={form.landmark}
          onChange={(e) => updateField('landmark', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pincode"
            placeholder="400001"
            value={form.pincode}
            onChange={(e) =>
              updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            required
          />
          <Input
            label="City"
            placeholder="Mumbai"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            required
          />
        </div>

        <div className="pt-4">
          <Button type="submit" fullWidth size="lg">
            Save Address
          </Button>
        </div>
      </form>
    </Modal>
  );
}
