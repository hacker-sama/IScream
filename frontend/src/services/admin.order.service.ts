/**
 * Admin Order Service — list orders, view detail, update status.
 * Requires ADMIN JWT token (automatically attached by apiClient).
 *
 * Backend routes:
 *   GET /api/management/orders                — paginated list with optional status filter
 *   GET /api/management/orders/{id}           — single order detail
 *   PUT /api/management/orders/{id}/status    — update order status
 */
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse, ItemOrder, PagedResult } from "@/types";

export const adminOrderService = {
  /** Paginated list with optional status filter */
  getAll: (page = 1, pageSize = 10, status?: string, startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };
    if (status) params.status = status;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return apiClient.get<ApiResponse<PagedResult<ItemOrder>>>(
      API_ENDPOINTS.management.orders.list,
      { params },
    );
  },

  /** Single order by ID */
  getById: (id: string) =>
    apiClient.get<ApiResponse<ItemOrder>>(
      API_ENDPOINTS.management.orders.byId(id),
    ),

  /** Update order status */
  updateStatus: (id: string, status: string) =>
    apiClient.put<ApiResponse<void>>(
      API_ENDPOINTS.management.orders.updateStatus(id),
      { status },
    ),
};
