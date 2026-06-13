import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Malformed JSON request body.",
          },
        },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "A valid email address is required.",
            fields: { email: ["Please enter a valid email address."] },
          },
        },
        { status: 422 }
      );
    }

    // Check if subscriber exists
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          {
            error: {
              code: "CONFLICT",
              message: "Email is already subscribed to the newsletter.",
            },
          },
          { status: 409 }
        );
      } else {
        // Reactivate subscriber
        await prisma.subscriber.update({
          where: { email },
          data: { is_active: true, unsubscribed_at: null },
        });
        return NextResponse.json({ success: true, message: "Subscription reactivated." }, { status: 200 });
      }
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        is_active: true,
        source: "api_route",
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API /api/subscribe POST error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected server error occurred.",
        },
      },
      { status: 500 }
    );
  }
}
