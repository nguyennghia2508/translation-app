import { NextResponse } from "next/server";
import { lookupWord } from "@/lib/dictionaryService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, userId } = body;

    if (!word) {
      return NextResponse.json(
        { error: "Word is required" },
        { status: 400 }
      );
    }

    const result = await lookupWord({
      word,
      userId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Dictionary lookup failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      dictionaryData: result.dictionaryData,
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