import Button from "@/components/common/Button";
import PeopleMap from "@/components/pages/PeopleMap";
import { siteConfig } from "./config";
import Link from "next/link";
import AddMeMapModal from "@/components/layout/AddMeMapModal";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main>
      <menu>
        <SignedIn>
          <AddMeMapModal />
        </SignedIn>
        <SignedOut>
          <Button as={Link} href={siteConfig.pages.register}>
            Registrate
          </Button>
        </SignedOut>
      </menu>
      <section className="h-[80vh] w-[90vw]">
        <PeopleMap />
      </section>
    </main>
  );
}
