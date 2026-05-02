import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  buildFastestPerLegPreview,
  buildRouteAlternatives,
} from "@/lib/routing/osrm";
import type { RoutePointDto, RoutePreviewResponseDto } from "@/lib/routePointTypes";

export const dynamic = "force-dynamic";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;
  if (!userId) return null;
  return getCurrentUser(userId);
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Brak autoryzacji" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Nieprawidlowe dane trasy" },
      { status: 400 }
    );
  }

  const points = ((body as { points?: RoutePointDto[] } | null)?.points ?? []) as RoutePointDto[];
  if (!Array.isArray(points)) {
    return NextResponse.json(
      { success: false, message: "Brak listy punktow do wyznaczenia trasy" },
      { status: 400 }
    );
  }

  try {
    const withCoords = points.filter(
      (p) => p?.lat != null && p?.lng != null && Number.isFinite(p.lat) && Number.isFinite(p.lng)
    );

    let response: RoutePreviewResponseDto = { preview: null };

    if (withCoords.length === 2) {
      const alternatives = await buildRouteAlternatives(withCoords[0], withCoords[1], 3);
      response = {
        preview: alternatives[0]?.preview ?? null,
        alternatives,
      };
    } else {
      response = { preview: await buildFastestPerLegPreview(points, 3) };
    }

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error("Route preview error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Nie udalo sie wyznaczyc podgladu trasy.",
      },
      { status: 500 }
    );
  }
}
