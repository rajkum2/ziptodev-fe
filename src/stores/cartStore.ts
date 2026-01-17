import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartPreferences {
  instructions: string;
  tip: number;
  needBag: boolean;
}

interface CartTotals {
  itemTotalMrp: number;
  itemTotalSelling: number;
  discountOnMrp: number;
  deliveryFee: number;
  handlingFee: number;
  tip: number;
  toPay: number;
  totalSavings: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  preferences: CartPreferences;
  noFeesActive: boolean;
  addItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, variantId: string) => number;
  setInstructions: (instructions: string) => void;
  setTip: (tip: number) => void;
  setNeedBag: (needBag: boolean) => void;
  calculateTotals: (productPrices: Map<string, { mrp: number; price: number }>) => CartTotals;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      preferences: {
        instructions: '',
        tip: 0,
        needBag: true,
      },
      noFeesActive: true,

      addItem: (productId, variantId) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === productId && item.variantId === variantId
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId && item.variantId === variantId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { productId, variantId, quantity: 1 }],
          };
        }),

      updateQuantity: (productId, variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !(item.productId === productId && item.variantId === variantId)
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity }
                : item
            ),
          };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        })),

      clearCart: () =>
        set({
          items: [],
          preferences: {
            instructions: '',
            tip: 0,
            needBag: true,
          },
        }),

      getItemQuantity: (productId, variantId) => {
        const item = get().items.find(
          (i) => i.productId === productId && i.variantId === variantId
        );
        return item?.quantity || 0;
      },

      setInstructions: (instructions) =>
        set((state) => ({
          preferences: { ...state.preferences, instructions },
        })),

      setTip: (tip) =>
        set((state) => ({
          preferences: { ...state.preferences, tip },
        })),

      setNeedBag: (needBag) =>
        set((state) => ({
          preferences: { ...state.preferences, needBag },
        })),

      calculateTotals: (productPrices) => {
        const state = get();
        let itemTotalMrp = 0;
        let itemTotalSelling = 0;
        let itemCount = 0;

        state.items.forEach((item) => {
          const prices = productPrices.get(`${item.productId}_${item.variantId}`);
          if (prices) {
            itemTotalMrp += prices.mrp * item.quantity;
            itemTotalSelling += prices.price * item.quantity;
            itemCount += item.quantity;
          }
        });

        const discountOnMrp = itemTotalMrp - itemTotalSelling;
        const deliveryFee = itemTotalSelling >= 99 ? 0 : 30;
        const handlingFee = state.noFeesActive ? 0 : 10;
        const tip = state.preferences.tip;
        const toPay = itemTotalSelling + deliveryFee + handlingFee + tip;

        const deliverySavings = itemTotalSelling >= 99 ? 30 : 0;
        const handlingSavings = state.noFeesActive ? 10 : 0;
        const totalSavings = discountOnMrp + deliverySavings + handlingSavings;

        return {
          itemTotalMrp,
          itemTotalSelling,
          discountOnMrp,
          deliveryFee,
          handlingFee,
          tip,
          toPay,
          totalSavings,
          itemCount,
        };
      },
    }),
    {
      name: 'zipto-cart',
    }
  )
);
