import Header from "@/components/Header";
import TranslationPanel from "@/components/TranslationPanel";

export default function TranslatePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
                <div className="w-full max-w-4xl space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                            Translate
                        </h1>
                        <p className="text-muted-foreground">
                            Translate text between Vietnamese and English with high accuracy.
                        </p>
                    </div>
                    <TranslationPanel />
                </div>
            </main>
        </div>
    );
} 