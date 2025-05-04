import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "./prisma";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export interface DictionaryRequest {
  word: string;
  userId?: string;
}

export interface DictionaryResult {
  dictionaryData: DictionaryData | null;
  success: boolean;
  savedToDb: boolean;
  error?: string;
}

export interface DictionaryData {
  [key: string]: any;
  word: string;
  phonetics: string;
  meanings: Meaning[];
  translation: string;
  sourceLanguage: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: string[];
  examples?: string[];
}

// Simple language detection (can be improved)
function detectLanguage(word: string): "en" | "vi" {
  // Vietnamese characters that are not in English
  const vietnameseChars = "ăâàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
  
  for (const char of word.toLowerCase()) {
    if (vietnameseChars.includes(char)) {
      return "vi";
    }
  }
  
  return "en";
}

export async function lookupWord(
  request: DictionaryRequest
): Promise<DictionaryResult> {
  const { word, userId } = request;
  
  if (!word) {
    return {
      dictionaryData: null,
      success: false,
      savedToDb: false,
      error: "Word is required"
    };
  }

  try {
    const sourceLanguage = detectLanguage(word);
    const targetLanguage = sourceLanguage === "en" ? "vi" : "en";
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,
      },
    });
    
    const prompt = `You are a comprehensive Vietnamese-English dictionary API. Generate a JSON response with information about the given word with this exact structure:
    {
      "word": "the original word",
      "phonetics": "pronunciation guide in IPA format as a simple string",
      "meanings": [
        {
          "partOfSpeech": "part of speech (noun, verb, etc.)",
          "definitions": ["definition 1", "definition 2"],
          "examples": ["example sentence 1", "example sentence 2"]
        }
      ],
      "translation": "translation to ${targetLanguage === "en" ? "English" : "Vietnamese"}",
      "sourceLanguage": "${sourceLanguage}"
    }

    VERY IMPORTANT: 
    1. Phonetics MUST be a simple string, not an object
    2. Respond ONLY with the JSON object, no explanations or other text
    3. Ensure it's valid JSON
    4. Examples array is optional and only include it if you have examples

    The word to look up is: "${word}"`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      return {
        dictionaryData: null,
        success: false,
        savedToDb: false,
        error: "No dictionary data received"
      };
    }

    // Extract JSON from response text by finding the first '{' and last '}'
    let jsonText = responseText;
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      jsonText = responseText.substring(firstBrace, lastBrace + 1);
    }

    try {
      // Parse the JSON response
      const dictionaryData = JSON.parse(jsonText);
      
      // Ensure the structure matches what the frontend expects
      const sanitizedData = {
        word: dictionaryData.word || word,
        phonetics: dictionaryData.phonetics || "",
        meanings: Array.isArray(dictionaryData.meanings) ? dictionaryData.meanings : [],
        translation: dictionaryData.translation || "",
        sourceLanguage: dictionaryData.sourceLanguage || sourceLanguage
      };
      
      let savedToDb = false;
      if (userId) {
        try {
          await prisma.dictionaryLookup.create({
            data: {
              userId,
              word,
              result: sanitizedData as DictionaryData,
              sourceLanguage,
              targetLanguage,
            },
          });
          savedToDb = true;
        } catch (dbError) {
          console.error("Database error:", dbError);
        }
      }

      return {
        dictionaryData: sanitizedData,
        success: true,
        savedToDb
      };
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError, "Response text:", responseText);
      return {
        dictionaryData: null,
        success: false,
        savedToDb: false,
        error: "Failed to parse dictionary data"
      };
    }
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    return {
      dictionaryData: null,
      success: false,
      savedToDb: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 