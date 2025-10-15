import PeopleMap from "@/components/pages/PeopleMap";
import HeroSection from "@/components/pages/HeroSection";

export default async function Home() {
  return (
    <main className="-my-22 max-h-screen">
      <HeroSection />
      <section className="h-[98dvh] w-screen px-2 rounded-xl relative">
        <PeopleMap />
      </section>
    </main>
  );
}
