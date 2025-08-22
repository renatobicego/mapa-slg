import { siteConfig } from "@/app/config";
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return (
    <main>
      <UserProfile path={siteConfig.pages.profile} />
    </main>
  );
}
