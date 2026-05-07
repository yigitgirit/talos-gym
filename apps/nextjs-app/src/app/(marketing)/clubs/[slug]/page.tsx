import { notFound } from "next/navigation";
import { getClubBySlugAction } from "@/features/clubs/actions/club.actions";
import {
  ClubHero,
  ClubAbout,
  ClubFeatures,
  ClubFaq,
  ClubImageGallery,
} from "@/features/clubs";
import { Images } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ClubDetailsPage({ params }: Readonly<PageProps>) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const result = await getClubBySlugAction({ slug });

  if (!result.success || !result.data) {
    return notFound();
  }

  const club = result.data;
  const galleryImages = club.photoUrls?.slice(1) || [];
  
  return (
    <>
      <ClubHero club={club} />
      <ClubAbout club={club} />
      <ClubFeatures />

      {galleryImages.length > 0 && (
        <section className="w-full py-12 md:py-24 bg-muted/40 border-b border-border overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 mb-8 md:mb-10 shrink-0">
            <div className="flex items-center justify-center gap-3">
              <Images className="w-6 md:w-8 h-6 md:h-8 text-primary" />
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-center">Gallery</h2>
            </div>
          </div>
          
          <div className="w-full">
            <ClubImageGallery images={galleryImages} clubName={club.name} />
          </div>
        </section>
      )}

      <ClubFaq />
    </>
  );
}
