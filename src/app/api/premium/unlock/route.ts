import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { ApiAuthError, getRequiredUserId } from "@/lib/http/auth";
import { PremiumUnlockError } from "@/repositories/premium-repository";
import { unlockPremiumNameWithCredits } from "@/services/premium-service";

export const runtime = "nodejs";

const premiumUnlockBodySchema = z.object({
  babyNameId: z.coerce.bigint().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = getRequiredUserId(request);
    const body = premiumUnlockBodySchema.parse(await request.json());
    const result = await unlockPremiumNameWithCredits(userId, body.babyNameId);

    return NextResponse.json({
      ok: true,
      data: result,
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

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_UNLOCK_REQUEST",
          message: "Invalid premium unlock request.",
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
    const statusByCode: Record<PremiumUnlockError["code"], number> = {
      USER_NOT_FOUND: 404,
      NAME_NOT_FOUND: 404,
      NAME_IS_FREE: 409,
      INSUFFICIENT_CREDITS: 402,
    };

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: statusByCode[error.code] },
    );
  }

  console.error("Premium unlock API failed", error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "PREMIUM_UNLOCK_FAILED",
        message: "Unable to unlock this premium name right now.",
      },
    },
    { status: 500 },
  );
}
