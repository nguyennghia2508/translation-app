import { NextResponse } from "next/server";
import { translateText } from "@/lib/translationService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, fromLanguage, toLanguage, userId } = body;

    if (!text || !fromLanguage || !toLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await translateText({
      text,
      fromLanguage,
      toLanguage,
      userId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Translation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      translatedText: result.translatedText,
      savedToDb: result.savedToDb
    });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 