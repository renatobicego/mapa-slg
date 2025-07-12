import Button from "@/components/common/Button";
import PeopleMap from "@/components/pages/PeopleMap";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";
import { siteConfig } from "./config";
import Link from "next/link";
import AddMeMapModal from "@/components/layout/AddMeMapModal";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <menu>
        {session ? (
          <AddMeMapModal />
        ) : (
          <Button as={Link} href={siteConfig.pages.register}>
            Registrate
          </Button>
        )}
      </menu>
      <section className="h-[80vh] w-[90vw]">
        <PeopleMap />
      </section>
    </main>
  );
}
