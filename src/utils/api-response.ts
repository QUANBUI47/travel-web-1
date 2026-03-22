import { NextResponse } from "next/server";

export interface ApiResponseOptions<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  status?: number;
}

export function createApiResponse<T>({
  success,
  message,
  data,
  error,
  status = 200,
}: ApiResponseOptions<T>) {
  return NextResponse.json(
    {
      success,
      message: message || (success ? "Success" : "Error"), // Fallback if no translated string is provided
      data: data || null,
      error: error || null,
    },
    { status }
  );
}

// Helpers
export function successResponse<T>(data?: T, message?: string, status = 200) {
  return createApiResponse({ success: true, data, message, status });
}

export function errorResponse(error?: any, message?: string, status = 400) {
  return createApiResponse({ success: false, error, message, status });
}
