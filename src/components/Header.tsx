"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { LuSunDim, LuMoon, LuMenu } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Avoid hydration mismatch by only rendering theme-dependent UI after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-xl font-bold text-foreground"
                    >
                        Translate<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x animate-pulse">AI</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/translate"
                            className={`text-sm font-medium relative ${pathname === "/translate"
                                ? "text-foreground after:absolute after:block after:h-[2px] after:w-full after:bg-foreground after:bottom-[-4px]"
                                : "text-muted-foreground hover:text-foreground after:absolute after:block after:h-[2px] after:bg-foreground after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                                }`}
                        >
                            Translate
                        </Link>
                        <Link
                            href="/dictionary"
                            className={`text-sm font-medium relative ${pathname === "/dictionary"
                                ? "text-foreground after:absolute after:block after:h-[2px] after:w-full after:bg-foreground after:bottom-[-4px]"
                                : "text-muted-foreground hover:text-foreground after:absolute after:block after:h-[2px] after:bg-foreground after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                                }`}
                        >
                            Dictionary
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground relative overflow-hidden transition-all duration-300 hover:text-background hover:bg-foreground after:absolute after:inset-0 after:bg-foreground after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:rounded-md"
                            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                        >
                            <span className="relative z-10">
                                {theme === "dark" ? <LuSunDim size={20} /> : <LuMoon size={20} />}
                            </span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                        <LuMenu size={20} />
                    </button>
                </div>
            </div>
            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <nav className="flex flex-col p-4 space-y-2">
                        <Link
                            href="/translate"
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${pathname === "/translate"
                                ? "bg-foreground/90 text-background"
                                : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Translate
                        </Link>
                        <Link
                            href="/dictionary"
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${pathname === "/dictionary"
                                ? "bg-foreground/90 text-background"
                                : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dictionary
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
} 