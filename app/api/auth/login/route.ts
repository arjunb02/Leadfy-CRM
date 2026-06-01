import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";
import { ok, badRequest, handleError } from "@/lib/api-helpers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return badRequest("Invalid email or password");
    }

    if (user.status !== "active") {
      return badRequest("Account is inactive. Contact your administrator.");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return ok({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        status: user.status,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
