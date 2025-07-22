import { AppLayout } from "@/components/app-layout";
import { ShowcaseCard } from "@/components/showcase-card";
import { mockShowcases } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShowcasesPage() {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-bold">Product Showcases</h1>
        <Button asChild>
          <Link href="/showcases/new">Submit Product</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockShowcases.map((showcase) => (
          <ShowcaseCard key={showcase.id} showcase={showcase} />
        ))}
      </div>
    </AppLayout>
  );
}
