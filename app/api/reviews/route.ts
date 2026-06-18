import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validation/review";

// Public: anyone (guest or logged-in) may read and submit application reviews.
export async function GET() {
  return handleRoute(async () => {
    const reviews = await db.applicationReview.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return jsonOk({ reviews });
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json().catch(() => null);
    const data = reviewSchema.parse(body);

    // Stored as raw text via Prisma (parameterized — no SQL injection). It is
    // always rendered as escaped text on the client, never as HTML.
    const review = await db.applicationReview.create({ data });
    return jsonOk({ review }, 201);
  });
}
