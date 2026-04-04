import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Find the Perfect Painter for Your Project
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Connect with professional painters in your area. Get quotes, compare prices, and hire with confidence.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/join">Get Started</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/for-painters">For Painters</Link>
        </Button>
      </div>
    </div>
  );
}
