"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { LuCopy } from "react-icons/lu";

interface DictionaryResult {
    word: string;
    phonetics: string;
    meanings: {
        partOfSpeech: string;
        definitions: string[];
        examples?: string[];
    }[];
    translation: string;
    sourceLanguage: "en" | "vi";
}

interface ApiResponse {
    dictionaryData: DictionaryResult;
    savedToDb: boolean;
    error?: string;
}

export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState<DictionaryResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/dictionary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word: searchTerm }),
            });
            const data: ApiResponse = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Dictionary lookup failed");
            }
            setResult(data.dictionaryData);
        } catch (error) {
            console.error("Dictionary error:", error);
            setError(error instanceof Error ? error.message : "Dictionary lookup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                            Dictionary
                        </h1>
                        <p className="text-muted-foreground">
                            Look up words in Vietnamese or English
                        </p>
                    </div>

                    <div className="flex w-full max-w-2xl mx-auto items-center space-x-2">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type a word to look up..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={!searchTerm.trim() || isLoading}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/90 px-6 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="text-center text-muted-foreground">
                            Looking up word...
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="text-center text-destructive">
                            {error}
                        </div>
                    )}

                    {result && !isLoading && (
                        <div className="rounded-lg border border-input bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {result.word}
                                </h2>
                                <button
                                    onClick={() => handleCopyToClipboard(result.word)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:hover:text-foreground disabled:hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Copy word"
                                >
                                    <LuCopy size={18} />
                                </button>
                            </div>

                            {result.phonetics && (
                                <p className="mt-1 text-muted-foreground">
                                    {result.phonetics}
                                </p>
                            )}

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                    <h3 className="text-lg font-medium text-foreground">
                                        Translation
                                    </h3>
                                    <div className="ml-2 rounded-md bg-foreground px-2 py-0.5 text-xs font-medium text-background">
                                        {result.sourceLanguage === "en" ? "Vietnamese" : "English"}
                                    </div>
                                </div>
                                <p className="text-foreground">{result.translation}</p>
                            </div>

                            <div className="mt-8 space-y-6">
                                {result.meanings.map((meaning, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-medium text-foreground">
                                                {meaning.partOfSpeech}
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 pl-5 list-disc marker:text-foreground">
                                            {meaning.definitions.map((definition, defIndex) => (
                                                <li key={defIndex} className="text-foreground">
                                                    {definition}
                                                </li>
                                            ))}
                                        </ul>

                                        {meaning.examples && meaning.examples.length > 0 && (
                                            <div className="mt-2 pl-5">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Examples:
                                                </p>
                                                <ul className="space-y-1 pl-5 list-disc marker:text-muted-foreground">
                                                    {meaning.examples.map((example, exIndex) => (
                                                        <li key={exIndex} className="italic text-muted-foreground">
                                                            {example}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {copied && (
                        <div className="fixed bottom-4 right-4 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
                            Copied to clipboard!
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 