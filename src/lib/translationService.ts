// lib/translationService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "./prisma";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  userId?: string;
}

export interface TranslationResult {
  translatedText: string;
  success: boolean;
  savedToDb: boolean;
  error?: string;
}

export async function translateText(
  request: TranslationRequest
): Promise<TranslationResult> {
  const { text, fromLanguage, toLanguage, userId } = request;
  
  const targetLanguage = toLanguage === "en" ? "English" : "Vietnamese";
  const sourceLanguage = fromLanguage === "en" ? "English" : "Vietnamese";

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "text/plain",
      },
    });

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `You are a precise translator that must translate exactly like Google Translate. Follow these rules strictly:
            1. Translate the text from ${sourceLanguage} to ${targetLanguage} exactly like Google Translate would
            2. For similar or identical phrases, always return the exact same translation
            3. DO NOT change any:
              - Proper nouns handling (only apply if all these conditions are met):
                * The word is capitalized  
                * The word appears in a known Vietnamese names list
                * The word is used in a name-relevant context, including:
                  - After phrases like: "tôi tên là", "tên tôi là", "đây là", "gặp", "gọi là", etc.
                  - Or after a Vietnamese kinship/family term, such as: "anh", "chị", "em", "cô", "dì", "chú", "bác", "ông", "bà"
                * It is used in a name-relevant context (e.g., after “my name is”, “tôi tên là”, “gặp anh”, OR after family titles like “chú”, “bác”, “cô”, etc.)
                * If translating FROM Vietnamese:
                  - Remove diacritics from Vietnamese names (e.g., "Nguyễn Văn A" → "Nguyen Van A")
                  - If preceded by a kinship term, translate the title as Mr., Mrs., Ms., etc. (e.g., "anh Tuấn" → "Mr. Tuan", "bà Hoa" → "Mrs. Hoa", "chú Nam" → "Uncle Nam")
                  - Capitalization if title is at the start of a sentence or paragraph
                * If translating TO Vietnamese:
                  - Add Vietnamese diacritics to Vietnamese names (e.g., "Nguyen Van A" → "Nguyễn Văn A")
                  - If preceded by a kinship term, translate the title as "anh", "chị", "em", "cô", "dì", "chú", "bác", "ông", "bà" (e.g., "Mr. Tuan" → "anh Tuấn", "Mrs. Hoa" → "bà Hoa", "Uncle Nam" → "chú Nam")
                  - Capitalization if title is at the start of a sentence or paragraph
                  * Words that are not capitalized, not in name context, or not Vietnamese names → leave unchanged
                * Non-Vietnamese names stay unchanged
              - Numbers (keep exactly as is)
              - Dates (keep format exactly as is, e.g., 25/08/2001 stays 25/08/2001)
              - Special characters
              - Line breaks
            4. DO NOT add any extra words or explanations
            5. DO NOT reformat or rewrite dates/numbers in a different style
            6. Names must follow the diacritics rule based on translation direction and only if confidently identified as Vietnamese proper names
            7. KEEP THE SAME PUNCTUATION AND FORMATTING AS THE ORIGINAL TEXT AND DO NOT CHANGE IT WITH ANY OTHER PUNCTUATION OR FORMATTING

            Text to translate:

            ${text}`,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents,
    });

    const translatedText = result.response.text().trim();

    if (!translatedText) {
      return {
        translatedText: "",
        success: false,
        savedToDb: false,
        error: "No translation received",
      };
    }

    let savedToDb = false;
    if (userId) {
      try {
        await prisma.translation.create({
          data: {
            userId,
            sourceText: text,
            translatedText,
            fromLanguage,
            toLanguage,
          },
        });
        savedToDb = true;
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    return {
      translatedText,
      success: true,
      savedToDb,
    };
  } catch (error) {
    console.error("Translation error:", error);
    return {
      translatedText: "",
      success: false,
      savedToDb: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 