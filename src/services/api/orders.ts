import { api } from './config';
import type { ApiResponse, Order } from './types';

export const ordersApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Record<string, Order>>>('/orders');
    return response.data ? Object.values(response.data) : [];
  },

  getById: async (orderId: string) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },

  scan: async (orderId: string, sku: string) => {
    const response = await api.post<ApiResponse>('/scan', { order_id: orderId, sku });
    return response.data;
  },

  updateStatus: async (orderId: string, status: string) => {
    const response = await api.put<ApiResponse>(`/orders/${orderId}/status`, { status });
    return response;
  },
};