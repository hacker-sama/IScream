/**
 * Checkout service — unified shop checkout.
 *
 * Step 1: POST /api/checkout             → create order, returns checkoutId + orderNo
 * Step 2: POST /api/checkout/{id}/pay    → submit card, returns final status
 */
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse } from "@/types";

export interface CreateCheckoutRequest {
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  itemId: string;
  quantity: number;
}

export interface PayCheckoutRequest {
  cardNumber: string;
  expiry: string; // MM/YY
  cvv: string;
}

export interface CheckoutResult {
  checkoutId: string;
  orderNo: string;
  totalAmount: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  cardLast4?: string;
}

export const checkoutService = {
  create: (req: CreateCheckoutRequest) =>
    apiClient.post<ApiResponse<CheckoutResult>>(
      API_ENDPOINTS.checkout.create,
      req,
    ),

  pay: (checkoutId: string, req: PayCheckoutRequest) =>
    apiClient.post<ApiResponse<CheckoutResult>>(
      API_ENDPOINTS.checkout.pay(checkoutId),
      req,
    ),
};
