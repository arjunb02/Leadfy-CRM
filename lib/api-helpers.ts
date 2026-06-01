import { NextResponse } from "next/server";
import { AuthError } from "./auth";
import { PermissionError } from "./permissions";

// ─── Standard API Response Wrappers ──────────────────────────

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function notFound(resource = "Resource") {
  return NextResponse.json(
    { success: false, error: `${resource} not found` },
    { status: 404 },
  );
}

// ─── Error Handler ────────────────────────────────────────────

export function handleError(err: unknown) {
  console.error("[API Error]", err);

  if (err instanceof AuthError) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.status },
    );
  }
  if (err instanceof PermissionError) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 403 },
    );
  }
  if (err instanceof Error) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 },
  );
}

// ─── Pagination Helper ────────────────────────────────────────

export function parsePagination(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") ?? "20"));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
