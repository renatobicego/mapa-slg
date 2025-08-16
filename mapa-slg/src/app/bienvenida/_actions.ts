"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async () => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "Usuario no autenticado" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch {
    return {
      error:
        "Hubo un error al registrar los datos. Por favor, intente nuevamente.",
    };
  }
};
