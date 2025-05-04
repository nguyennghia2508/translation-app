"use client";

import { useThemeStore } from "@/store/themeStore";
import { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "./Icons";

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by only rendering after component is mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
            {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
            ) : (
                <MoonIcon className="h-5 w-5" />
            )}
        </button>
    );
} 