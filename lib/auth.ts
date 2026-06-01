import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import prisma from "./db";

const JWT_SECRET =
  process.env.JWT_SECRET || "crm-super-secret-key-change-in-production";
const JWT_EXPIRES = "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
}

// ─── Token Helpers ───────────────────────────────────────────

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

// ─── Auth Guard ───────────────────────────────────────────────

export async function requireAuth(req: NextRequest): Promise<JwtPayload> {
  const token = extractToken(req);
  if (!token) throw new AuthError("No token provided", 401);

  try {
    return verifyToken(token);
  } catch {
    throw new AuthError("Invalid or expired token", 401);
  }
}

// ─── Password Helpers ─────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ─── Current User ─────────────────────────────────────────────

export async function getCurrentUser(req: NextRequest) {
  const payload = await requireAuth(req);
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: { include: { permissions: true } } },
  });
  if (!user || user.status !== "active")
    throw new AuthError("User not found or inactive", 401);
  return user;
}

// ─── Custom Error ─────────────────────────────────────────────

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}
