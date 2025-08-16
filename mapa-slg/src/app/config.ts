export const siteConfig = {
  title: "Mapa SLG",
  description: "Mapa SLG",
  url: "https://mapa-slg.vercel.app",
  ogImage: "https://mapa-slg.vercel.app/og.jpg",
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  pages: {
    register: "/registrarse",
    login: "/iniciar-sesion",
    home: "/",
    onboarding: "/bienvenida",
  },
};
