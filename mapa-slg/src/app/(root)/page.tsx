import Button from "@/components/common/Button";
import PeopleMap from "@/components/pages/PeopleMap";
import Link from "next/link";
import AddMeMapModal from "@/components/layout/AddMeMapModal";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { siteConfig } from "../config";
import HeroSection from "@/components/pages/HeroSection";

export default async function Home() {
  return (
    <main className="-my-22 overflow-hidden">
      <HeroSection />
      <menu className="absolute">
        <SignedIn>
          <AddMeMapModal />
        </SignedIn>
        <SignedOut>
          <Button as={Link} href={siteConfig.pages.register}>
            Registrate
          </Button>
        </SignedOut>
      </menu>
      <section className="h-[95dvh] w-screen px-2 rounded-xl">
        <PeopleMap />
      </section>
    </main>
  );
}
