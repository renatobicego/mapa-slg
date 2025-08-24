import RegisterForm from "@/components/pages/Register";
import Image from "next/image";

export default function Onboarding() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black gap-10">
      <Image
        alt="Logo 100 años"
        src="/logo-monocromatico.png"
        width={300}
        height={200}
        unoptimized
        className="-mt-20"
      />
      <RegisterForm />
    </main>
  );
}
