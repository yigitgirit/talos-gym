import { Suspense } from "react";
import { ClubFilters, ClubGrid } from "@/features/clubs";
import { parseSearchParams } from "@/lib/search-params-utils";
import { NextPageSearchParams } from "@/features/common/types/search-params";
import { ClubSearchUrl, ClubSearchUrlSchema } from "@/features/clubs/schemas";

type PageProps = {
  searchParams: Promise<NextPageSearchParams>;
};

export default async function ClubsPage({ searchParams }: Readonly<PageProps>) {
  const filters: ClubSearchUrl = await parseSearchParams(searchParams, ClubSearchUrlSchema);

  return (
    <>
      {/* Header Section */}
      <section className="w-full py-12 md:py-16 bg-linear-to-b from-primary/10 to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">
              Find Your Club
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover the best gyms in your area. Filter by location and find the perfect place for your workout.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full pb-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-8">
@            <Suspense fallback={<div className="h-[120px] rounded-xl bg-primary/5 border border-primary/10 animate-pulse" />}>
              <ClubFilters />
            </Suspense>
          </div>

          <div className="mt-8">
            <Suspense key={JSON.stringify(filters)} fallback={<div className="text-center py-12">Loading clubs...</div>}>
              <ClubGrid filters={filters} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
