/**
 * Admin Feedback Service — list, view, mark as read.
 * Requires ADMIN JWT token (automatically attached by apiClient).
 *
 * Backend routes:
 *   GET   /api/management/feedbacks                       — paginated list
 *   GET   /api/management/feedbacks/{id}                  — single detail
 *   PATCH /api/management/feedbacks/{id}/mark-read        — mark as read
 */
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ApiResponse, Feedback, PagedResult } from "@/types";

export const adminFeedbackService = {
  /** Paginated list */
  getAll: (page = 1, pageSize = 10) =>
    apiClient.get<ApiResponse<PagedResult<Feedback>>>(
      API_ENDPOINTS.management.feedbacks.list,
      { params: { page: String(page), pageSize: String(pageSize) } },
    ),

  /** Single feedback entry */
  getById: (id: string) =>
    apiClient.get<ApiResponse<Feedback>>(
      API_ENDPOINTS.management.feedbacks.byId(id),
    ),

  /** Mark a feedback entry as read */
  markRead: (id: string) =>
    apiClient.patch<ApiResponse<void>>(
      API_ENDPOINTS.management.feedbacks.markRead(id),
    ),
};
