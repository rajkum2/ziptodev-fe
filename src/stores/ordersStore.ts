import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, CartItem, Address } from '../types';

interface OrdersState {
  orders: Order[];
  createOrder: (
    items: CartItem[],
    address: Address,
    total: number,
    savings: number,
    deliveryFee: number,
    handlingFee: number,
    tip: number,
    instructions: string,
    needBag: boolean
  ) => string;
  getOrder: (id: string) => Order | null;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items, address, total, savings, deliveryFee, handlingFee, tip, instructions, needBag) => {
        const id = `ORD${Date.now()}`;
        const order: Order = {
          id,
          items: [...items],
          address,
          total,
          savings,
          status: 'placed',
          createdAt: new Date().toISOString(),
          deliveryFee,
          handlingFee,
          tip,
          instructions,
          needBag,
        };
        set((state) => ({
          orders: [order, ...state.orders],
        }));
        return id;
      },

      getOrder: (id) => {
        return get().orders.find((o) => o.id === id) || null;
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),
    }),
    {
      name: 'zipto-orders',
    }
  )
);
