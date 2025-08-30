"use client";
import AddMeMapModal from "@/components/layout/AddMeMapModal";

export default function Help() {
  return (
    <main className="min-h-screen text-black pt-8 flex flex-col text-left !items-start justify-start gap-2 pb-20 lg:pt-12 2xl:pt-16 max-w-screen-lg mx-auto">
      <h1 className="heading-1">¿Cómo Participar?</h1>
      <p>En 3 simples pasos:</p>
      <ol className="list-decimal pl-5">
        <li>
          <b>Registrate</b> - Crea tu cuenta con tu email.
        </li>
        <li>
          <b>Ubicate</b> - Coloca tu pin en el mapa donde te encuentres.
        </li>
        <li>
          <b>Compartí</b> - Invita a otros compañeros a sumarse.
        </li>
      </ol>
      <h2 className="heading-2 mt-8">¿Quiénes pueden participar?</h2>
      <p>Toda la familia San Lucho:</p>
      <ol className="list-decimal pl-5 mb-4">
        <li>
          <b>Alumnos actuales</b> - Los protagonistas de hoy.
        </li>
        <li>
          <b>Ex alumnos </b>- Nuestros egresados de todas las generaciones
        </li>
        <li>
          <b>Docentes</b> - Quienes forman corazones y mentes
        </li>
        <li>
          <b>Personal no docente</b> - El equipo que hace posible cada día
        </li>
        <li>
          <b>Familias</b> - Parte fundamental de nuestra comunidad
        </li>
      </ol>
      <AddMeMapModal />
    </main>
  );
}
