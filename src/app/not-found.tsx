import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl">Counter Not Found</h2>
      <p className="text-lg opacity-70">
        The counter you&apos;re looking for doesn&apos;t exist or has been
        deleted.
      </p>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft />
        Go Home
      </Link>
    </div>
  );
}
