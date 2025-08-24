import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            logoBox: "!h-20 lg:!hidden",
          },
        }}
      />
    </main>
  );
}
