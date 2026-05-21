import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center min-h-screen">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        This page doesn&apos;t exist or has been moved. Head to the
        documentation to find what you&apos;re looking for.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go to docs</Link>
      </Button>
    </div>
  );
}
