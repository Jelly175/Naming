import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { PremiumUnlockError } from "@/repositories/premium-repository";
import { getUserPremiumStatus } from "@/services/premium-service";
import { ApiAuthError, getRequiredUserId } from "@/lib/http/auth";

export const runtime = "nodejs";

const premiumStatusQuerySchema = z.object({
  babyNameId: z.coerce.bigint().positive().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = getRequiredUserId(request);
    const { babyNameId } = premiumStatusQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const status = await getUserPremiumStatus(userId, babyNameId);

    return NextResponse.json({
      ok: true,
      data: status,
    });
  } catch (error) {
    return premiumApiErrorResponse(error);
  }
}

function premiumApiErrorResponse(error: unknown) {
  if (error instanceof ApiAuthError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "AUTH_REQUIRED",
          message: error.message,
        },
      },
      { status: 401 },
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_PREMIUM_STATUS_REQUEST",
          message: "Invalid premium status request.",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof PremiumUnlockError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.code === "USER_NOT_FOUND" ? 404 : 400 },
    );
  }

  console.error("Premium status API failed", error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "PREMIUM_STATUS_FAILED",
        message: "Unable to check premium status right now.",
      },
    },
    { status: 500 },
  );
}
