'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ClientThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useThemeStore();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        // Set mounted to true after initial render
        setMounted(true);

        // Ensure the UI shows the correct theme
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);

    // Only render children when mounted to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}