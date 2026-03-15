/**
 * Admin Item Service — CRUD operations for shop items.
 * Requires ADMIN JWT token for create/update/delete routes.
 */
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse, Item, PagedResult } from "@/types";

export interface CreateItemRequest {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  stock: number;
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  stock?: number;
}

export const adminItemService = {
  getAll: (page = 1, pageSize = 10, search?: string) => {
    const params: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };
    if (search) params.search = search;

    return apiClient.get<ApiResponse<PagedResult<Item>>>(
      API_ENDPOINTS.items.list,
      {
        params,
      },
    );
  },

  create: (data: CreateItemRequest) =>
    apiClient.post<ApiResponse<{ id: string }>>(
      API_ENDPOINTS.management.items.create,
      data,
    ),

  update: (id: string, data: UpdateItemRequest) =>
    apiClient.put<ApiResponse<void>>(
      API_ENDPOINTS.management.items.update(id),
      data,
    ),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.management.items.delete(id),
    ),
};
