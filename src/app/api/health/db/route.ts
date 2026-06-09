import { NextResponse } from "next/server";

import { checkDatabaseConnection } from "@/lib/db/health";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await checkDatabaseConnection();

    return NextResponse.json({
      ok: true,
      database: result,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Database connection failed.",
      },
      { status: 503 },
    );
  }
}
