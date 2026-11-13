import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeFeaturedSection from "@/components/HomeFeaturedSection";
import { getCachedApprovedCount, getCachedFeaturedDocuments } from "@/lib/cachedData";

export default async function Home() {
  const [totalCount, featuredDocuments] = await Promise.all([
    getCachedApprovedCount(),
    getCachedFeaturedDocuments(6),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-blue-100 selection:text-blue-700 font-sans">
      <Navbar />

      <main className="flex-1 pb-16">
        <Hero totalCount={totalCount} />
        <HomeFeaturedSection documents={featuredDocuments} totalCount={totalCount} />
      </main>
    </div>
  );
}
