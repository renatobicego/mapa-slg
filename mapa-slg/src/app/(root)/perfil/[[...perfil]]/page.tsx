import { siteConfig } from "@/app/config";
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return (
    <main className="h-screen w-screen overflow-y-auto">
      <UserProfile path={siteConfig.pages.profile} />
    </main>
  );
}
