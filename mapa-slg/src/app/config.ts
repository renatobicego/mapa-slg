export const siteConfig = {
  title: "100 Años - San Luis Gonzaga",
  description:
    "Nuestro querido Colegio San Luis Gonzaga cumple 100 años y lo vamos celebrar creando el Mapa del San Lucho. Agregá tu pin y formá parte de esta gran historia",
  url: "https://centenario.colegiosanluisgonzaga.edu.ar",
  ogImage: "https://centenario.colegiosanluisgonzaga.edu.ar/og.jpg",
  serverUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  pages: {
    register: "/registrarse",
    login: "/iniciar-sesion",
    home: "/",
    onboarding: "/bienvenida",
    history: "/historia",
    help: "/participar",
    profile: "/perfil",
    photos: "/fotos",
  },
};
