"use client";

import { useState, useEffect, useRef } from "react";
import { LuCopy } from "react-icons/lu";
import { IoSwapVerticalSharp } from "react-icons/io5";
type Language = "vi" | "en";

interface TranslationResult {
    text: string;
    fromLanguage: Language;
    toLanguage: Language;
}

export default function TranslationPanel() {
    const [inputText, setInputText] = useState("");
    const [result, setResult] = useState<TranslationResult | null>(null);
    const [fromLanguage, setFromLanguage] = useState<Language>("vi");
    const [toLanguage, setToLanguage] = useState<Language>("en");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFromLanguageChange = (lang: Language) => {
        if (lang === toLanguage) {
            setToLanguage(fromLanguage);
        }
        setFromLanguage(lang);
    };

    const handleToLanguageChange = (lang: Language) => {
        if (lang === fromLanguage) {
            setFromLanguage(toLanguage);
        }
        setToLanguage(lang);
    };

    const handleSwapLanguages = () => {
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);

        // If there's a result, swap input and output
        if (result) {
            setInputText(result.text);
            setResult(null);
        }
    };

    const handleCopyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText,
                    fromLanguage,
                    toLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            setResult({
                text: data.translatedText,
                fromLanguage,
                toLanguage,
            });
        } catch (error) {
            console.error("Translation error:", error);
            // Handle error (could show error message to user)
        } finally {
            setIsLoading(false);
        }
    };

    const getLanguageName = (code: Language) => {
        return code === "vi" ? "Vietnamese" : "English";
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [inputText]);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-secondary p-1">
                        <button
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${fromLanguage === "vi"
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-foreground/90 hover:text-background"
                                }`}
                            onClick={() => handleFromLanguageChange("vi")}
                        >
                            Vietnamese
                        </button>
                        <button
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${fromLanguage === "en"
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-foreground/90 hover:text-background"
                                }`}
                            onClick={() => handleFromLanguageChange("en")}
                        >
                            English
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Type in ${getLanguageName(fromLanguage)}...`}
                        className="min-h-[200px] w-full rounded-lg border border-input bg-background p-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 overflow-hidden resize-none"
                    ></textarea>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-secondary p-1">
                        <button
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${toLanguage === "vi"
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-foreground/90 hover:text-background"
                                }`}
                            onClick={() => handleToLanguageChange("vi")}
                        >
                            Vietnamese
                        </button>
                        <button
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${toLanguage === "en"
                                ? "bg-foreground text-background shadow-sm"
                                : "text-muted-foreground hover:bg-foreground/90 hover:text-background"
                                }`}
                            onClick={() => handleToLanguageChange("en")}
                        >
                            English
                        </button>
                    </div>
                    <button
                        onClick={handleCopyToClipboard}
                        disabled={!result}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:hover:text-foreground disabled:hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Copy result"
                    >
                        <LuCopy size={18} />
                    </button>
                </div>
                <div className="relative min-h-[200px] w-full rounded-lg wrap-break-word border border-input bg-background p-4 text-foreground focus-within:ring-1 focus-within:ring-ring/50">
                    {result ? (
                        <div className="whitespace-pre-wrap">{result.text}</div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            {isLoading ? "Translating..." : "Translation will appear here"}
                        </div>
                    )}
                    {copied && (
                        <div className="absolute bottom-4 right-4 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                            Copied!
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between md:col-span-2">
                <button
                    onClick={handleSwapLanguages}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <IoSwapVerticalSharp className="mr-2 h-4 w-4" />
                    Swap Languages
                </button>
                <button
                    onClick={handleTranslate}
                    disabled={!inputText.trim() || isLoading}
                    className="inline-flex h-10 items-center bg-foreground text-background hover:bg-foreground/90 disabled:hover:bg-foreground justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Translating..." : "Translate"}
                </button>
            </div>
        </div>
    );
} 