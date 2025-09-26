"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Image } from "@heroui/react";

export default function HistoryPage() {
  const [bgColor, setBgColor] = useState("#0ea5e9"); // default color

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const inView1 = useInView(section1Ref, { margin: "-50% 0px -50% 0px" });
  const inView2 = useInView(section2Ref, { margin: "-50% 0px -50% 0px" });
  const inView3 = useInView(section3Ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView1) setBgColor("#2C9DCB"); // blue
    else if (inView2) setBgColor("#D12532"); // red
    else if (inView3) setBgColor("#F0AB33"); // yellow
  }, [inView1, inView2, inView3]);

  return (
    <motion.main
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.5 }}
      className="h-screen text-white -my-24 flex flex-col items-center justify-start gap-8 pb-20 overflow-y-auto"
    >
      <section className="flex flex-col items-start justify-start pt-32 lg:pt-36 2xl:pt-40 w-full gap-8 max-w-screen-lg">
        <div className="flex flex-col items-start justify-start gap-2">
          <h1 className="heading-1">Nuestra Historia</h1>
          <p>
            Nuestro Colegio San Luis Gonzaga es heredero de una rica tradición
            que comenzó mucho antes de 1926. Aquí te contamos los hitos más
            importantes de nuestra historia.
          </p>
        </div>
        <Image
          ref={section1Ref}
          alt="Imagen 1"
          src="/image1.jpeg"
          className="w-full"
          removeWrapper
        />
        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="heading-2">Los primeros pasos (1609-1767)</h2>
          <ul className="mt-4 list-disc pl-5">
            <li>
              1609: Los jesuitas abren el &quot;Colegio de la Inmaculada&quot;,
              la primera escuela jesuita de Mendoza.
            </li>
            <li>1616: Se inician clases de segunda enseñanza.</li>
            <li>
              1757: El Colegio solicita al Rey de España convertirse en
              Universidad (rechazado).
            </li>
            <li>
              1767: Expulsión de los jesuitas de América - cierre del Colegio.
            </li>
          </ul>
        </div>
        <Image
          alt="Imagen 3"
          src="/image3.jpeg"
          className="w-full"
          removeWrapper
          ref={section2Ref}
        />
      </section>

      <section className="flex flex-col items-start justify-start gap-8 max-w-screen-lg">
        <div className="flex flex-col items-start justify-start gap-2">
          <h3 className="heading-2">El regreso y renacimiento (1878-1926)</h3>
          <ul className="mt-4 list-disc pl-5">
            <li>1878: Los jesuitas regresan a Mendoza tras su restauración.</li>
            <li>
              1908: Inauguración del Templo del Sagrado Corazón (San Martín y
              Colón).
            </li>
            <li>
              1926: Nace nuestro San Luis Gonzaga - inicio de la escuela
              primaria.
            </li>
            <li>1944: Comienza el Colegio secundario (Bachillerato).</li>
          </ul>
        </div>
        <Image
          alt="Imagen 2"
          src="/image2.jpg"
          className="w-full"
          removeWrapper
          ref={section3Ref}
        />
      </section>

      <section className="flex flex-col items-start justify-center gap-8 max-w-screen-lg">
        <div className="flex flex-col items-start justify-start gap-2">
          <h4 className="heading-2">
            Crecimiento y transformación (1972-2025)
          </h4>
          <ul className="mt-4 list-disc pl-5">
            <li>
              1972: Se crea la Asociación Civil - padres y madres asumen la
              gestión.
            </li>
            <li>1997: El Colegio se hace mixto.</li>
            <li>
              2009: Reestructuración con conducción colegiada (400 años después
              de la primera fundación).
            </li>
            <li>2016: Presentación del Proyecto Curricular Ignaciano.</li>
            <li>2018: Regreso oficial como &quot;Colegio Jesuita&quot;.</li>
            <li>2022: Más de 1000 estudiantes forman nuestra comunidad.</li>
          </ul>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <h4 className="heading-2">
            San Luis Gonzaga: Patrón de la Juventud Católica (1568-1591)
          </h4>
          <p>
            Luigi Gonzaga fue un joven jesuita que dedicó su vida al servicio de
            los más necesitados. Durante una epidemia en Roma, cuidó a los
            enfermos hasta contraer la enfermedad que le causó la muerte a los
            23 años. Su compasión, compromiso, libertad interior y espíritu de
            servicio son el ejemplo que nos inspira cada día.
          </p>
        </div>
      </section>
    </motion.main>
  );
}
