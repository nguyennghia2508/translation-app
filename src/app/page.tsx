import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center sm:justify-center justify-start pt-20 sm:pt-0 p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <div className="flex gap-2 items-center justify-center">
                Translate<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x animate-pulse">AI</span>
              </div>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A powerful translation tool that converts text between Vietnamese and English
              with high accuracy and context preservation.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center items-center">
            <Link
              href="/translate"
              className="inline-flex h-10 w-[180px] items-center justify-center whitespace-nowrap rounded-md bg-foreground text-background hover:bg-foreground/90 px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get Started
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/dictionary"
              className="inline-flex h-10 w-[180px] items-center justify-center whitespace-nowrap rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Dictionary
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
