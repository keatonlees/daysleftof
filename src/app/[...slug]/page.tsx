import Counter from "@/components/Counter/Counter";
import React from "react";

export default async function CounterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <Counter id={slug[1]} />
    </div>
  );
}
