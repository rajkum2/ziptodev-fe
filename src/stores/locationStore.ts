import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location, Address } from '../types';

interface LocationState {
  selectedLocation: Location | null;
  addresses: Address[];
  selectedAddressId: string | null;
  etaText: string;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string | null) => void;
  getSelectedAddress: () => Address | null;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocation: null,
      addresses: [],
      selectedAddressId: null,
      etaText: '10 mins',

      setLocation: (location) =>
        set({
          selectedLocation: location,
          etaText: location.isServiceable ? '8-10 mins' : 'Not serviceable',
        }),

      clearLocation: () =>
        set({
          selectedLocation: null,
          etaText: '10 mins',
        }),

      addAddress: (address) => {
        const id = `addr_${Date.now()}`;
        const isFirst = get().addresses.length === 0;
        set((state) => ({
          addresses: [
            ...state.addresses,
            { ...address, id, isDefault: isFirst },
          ],
          selectedAddressId: isFirst ? id : state.selectedAddressId,
        }));
      },

      updateAddress: (id, updates) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updates } : addr
          ),
        })),

      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr.id !== id),
          selectedAddressId:
            state.selectedAddressId === id ? null : state.selectedAddressId,
        })),

      selectAddress: (id) => set({ selectedAddressId: id }),

      getSelectedAddress: () => {
        const state = get();
        return state.addresses.find((a) => a.id === state.selectedAddressId) || null;
      },
    }),
    {
      name: 'zipto-location',
    }
  )
);
