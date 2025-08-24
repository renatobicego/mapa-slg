import { SignUp } from "@clerk/nextjs";

export default function Register() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            logoBox: "!h-20",
          },
        }}
      />
    </main>
  );
}
