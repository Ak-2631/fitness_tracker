import { NextResponse } from "next/server";

export type ApiError = {
  code: string;
  message: string;
  details?: any;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: any;
};

export class Api {
  static success<T>(data: T, status = 200, meta?: any) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta,
    };
    return NextResponse.json(response, { status });
  }

  static error(message: string, code = "INTERNAL_ERROR", status = 500, details?: any) {
    const response: ApiResponse<null> = {
      success: false,
      error: { code, message, details },
    };
    return NextResponse.json(response, { status });
  }

  static unauthorized(message = "Unauthorized access.") {
    return this.error(message, "UNAUTHORIZED", 401);
  }

  static badRequest(message: string, details?: any) {
    return this.error(message, "BAD_REQUEST", 400, details);
  }

  static notFound(message = "Resource not found.") {
    return this.error(message, "NOT_FOUND", 404);
  }
}
