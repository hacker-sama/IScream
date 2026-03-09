/**
 * Payment service – create and confirm a payment record.
 *
 * Backend routes:
 *   POST /api/payments              — create INIT payment (requires auth)
 *   POST /api/payments/{id}/confirm — confirm with card details + link to order
 */
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse } from "@/types";

export const paymentService = {
  create: (amount: number, currency = "VND") =>
    apiClient.post<ApiResponse<{ paymentId: string }>>(
      API_ENDPOINTS.payments.create,
      { amount, type: "BOOK", currency },
    ),

  confirm: (
    paymentId: string,
    linkedEntityId: string,
    cardNumber: string,
    expiry: string,
    cvv: string,
  ) =>
    apiClient.post<ApiResponse>(API_ENDPOINTS.payments.confirm(paymentId), {
      linkedEntityId,
      cardNumber,
      expiry,
      cvv,
    }),
};
