import Counter from "@/components/Counter/Counter";
import { notFound } from "next/navigation";
import { getCounterBySID } from "./actions";

export default async function CounterPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug } = await params;

  if (!slug || slug.length !== 2) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <Counter id={slug[1]} />
    </div>
  );
}
