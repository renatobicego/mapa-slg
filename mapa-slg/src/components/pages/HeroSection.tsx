"use client";

import { Image } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { useHeroStore } from "@/stores/useHeroStore";

const HeroSection = () => {
  const { isVisible, setIsVisible } = useHeroStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-screen h-[100dvh] fixed top-0 left-0 flex flex-col items-start justify-end p-8 backdrop-blur-xs bg-black/25 z-100 pb-20 [@media(min-width:1320px)]:pl-container-xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            alt="Logo 100 años"
            src="/logo-100-anios.png"
            className="w-full max-w-lg"
          />
          <h2 className="heading-2 mt-4 md:max-w-xl lg:max-w-3xl text-white font-bold drop-shadow">
            Nuestro querido Colegio San Luis Gonzaga cumple 100 años y lo vamos
            a celebrar creando el Mapa del San Lucho. <br /> Agregá tu pin y
            formá parte de esta gran historia
          </h2>
          <Button onPress={() => setIsVisible(false)} className="mt-6 shadow">
            Explorar Mapa
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeroSection;
