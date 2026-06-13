import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (_e) {
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

    const { name, email, company, message } = body;

    // Field Validations
    const fieldsErrors: Record<string, string[]> = {};
    if (!name || name.trim().length < 2) {
      fieldsErrors.name = ["Name must be at least 2 characters."];
    }
    if (!email || !email.includes("@")) {
      fieldsErrors.email = ["Please enter a valid email address."];
    }
    if (!message || message.trim().length < 10) {
      fieldsErrors.message = ["Message must be at least 10 characters."];
    }

    if (Object.keys(fieldsErrors).length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Request failed validation checks.",
            fields: fieldsErrors,
          },
        },
        { status: 422 }
      );
    }

    // Rate limiting (max 2 entries per email in 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentSubmissionsCount = await prisma.contact.count({
      where: {
        email,
        created_at: { gte: tenMinutesAgo },
      },
    });

    if (recentSubmissionsCount >= 2) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please try again in 10 minutes.",
          },
        },
        {
          status: 429,
          headers: { "Retry-After": "600" },
        }
      );
    }

    // Insert to DB
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        company: company || null,
        message,
        source: "api_route",
        status: "new",
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: contact.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API /api/contact POST error:", error);
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
