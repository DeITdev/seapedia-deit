import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Consistent API response shapes for success and error.
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: string; details?: unknown };

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function jsonOk<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(
  message: string,
  status = 400,
  details?: unknown,
): NextResponse<ApiFailure> {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

/**
 * Wrap a Route Handler so thrown ApiError / ZodError become consistent JSON
 * responses and unexpected errors return a generic 500 (no internals leaked).
 */
export function handleRoute<T>(
  fn: () => Promise<NextResponse<ApiSuccess<T>>>,
): Promise<NextResponse> {
  return fn().catch((err) => {
    if (err instanceof ApiError) {
      return jsonError(err.message, err.status, err.details);
    }
    if (err instanceof ZodError) {
      return jsonError("Validation failed.", 422, err.flatten());
    }
    console.error("Unhandled route error:", err);
    return jsonError("Something went wrong. Please try again.", 500);
  });
}
