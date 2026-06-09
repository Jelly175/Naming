import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

import { parseNameSearchParams } from "@/features/names/search-params";
import { searchNames } from "@/services/name-service";

export const runtime = "nodejs";

function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "INVALID_SEARCH_FILTERS",
        message: "One or more search filters are invalid.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const filters = parseNameSearchParams(request.nextUrl.searchParams);
    const result = await searchNames(filters);

    return NextResponse.json(
      {
        ok: true,
        data: result,
        meta: {
          tookMs: Date.now() - startedAt,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    console.error("Name search API failed", error);

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "NAME_SEARCH_FAILED",
          message: "Unable to search baby names right now.",
        },
      },
      { status: 500 },
    );
  }
}
