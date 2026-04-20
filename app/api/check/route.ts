import { NextRequest, NextResponse } from "next/server";
import { runPriceCheck } from "@/lib/checker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET?.trim();
  if (!configuredSecret) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${configuredSecret}`) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await runPriceCheck();
    return NextResponse.json(result, {
      status: result.ok ? 200 : 500,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected check failure";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        checkedAt: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
