import PeopleMap from "@/components/pages/PeopleMap";
import HeroSection from "@/components/pages/HeroSection";

export default async function Home() {
  return (
    <main className="-my-22 overflow-hidden">
      <HeroSection />
      <section className="h-[95dvh] lg:h-[98dvh] w-screen px-2 rounded-xl">
        <PeopleMap />
      </section>
    </main>
  );
}
