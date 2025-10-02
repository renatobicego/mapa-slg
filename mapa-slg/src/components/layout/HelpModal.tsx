import { useAuth } from "@clerk/nextjs";
import {
  ButtonProps,
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import React, { cloneElement, useState } from "react";
import AddMeMapModal from "./AddMeMapModal";
import { Edit, PlusIcon } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";

const HelpModal = ({
  button,
}: {
  button?: React.ReactElement<ButtonProps>;
}) => {
  const [prevDataExists, setPrevDataExists] = useState(false);
  const { isSignedIn } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const clonedButton = button
    ? cloneElement(
        button,
        isSignedIn
          ? {
              onClick: () => {
                onOpen();
              },
            }
          : {}
      )
    : null;

  const screenSize = useMediaQuery();
  const modalSize = screenSize.width && screenSize.width < 768 ? "full" : "2xl";
  return (
    <>
      {clonedButton ?? (
        <button
          className=" font-semibold text-large cursor-pointer"
          onClick={onOpen}
        >
          ¿Cómo Participar?
        </button>
      )}

      <Modal
        placement="center"
        scrollBehavior="inside"
        isOpen={isOpen}
        size={modalSize}
        onOpenChange={onOpenChange}
        classNames={{
          closeButton:
            "z-50 bg-black text-white hover:bg-black/80 cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="heading-3">¿Cómo Participar?</ModalHeader>
          <ModalBody className="items-start py-4">
            <p>En 3 simples pasos:</p>
            <ol className="list-decimal pl-5">
              <li>
                <b>+ Sumarme</b> - Tocá el botón de abajo que dice &quot;+
                Sumarme&quot;.
              </li>
              <li>
                <b>Ubicate</b> - Coloca tu pin en el mapa donde te encuentres.
              </li>
              <li>
                <b>Descripción</b> - Agregá algo que quieras contar sobre vos.
              </li>
              <li>
                <b>Compartí</b> - Invita a otros compañeros a sumarse.
              </li>
              <li>
                <b>Eidtar mi Pin</b> - Si ya cargaste tu pin, podés editarlo
                tocando &quot;Editar Mi Pin&quot;.
              </li>
            </ol>
            <h2 className="heading-3 mt-2">¿Quiénes pueden participar?</h2>
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
          </ModalBody>
          <ModalFooter>
            <AddMeMapModal
              prevDataExists={prevDataExists}
              button={
                <Button
                  startContent={
                    prevDataExists && isSignedIn ? (
                      <Edit size={20} />
                    ) : (
                      <PlusIcon size={20} />
                    )
                  }
                  className="font-semibold bg-black text-white cursor-pointer w-auto text-small flex gap-1 items-center "
                >
                  {prevDataExists && isSignedIn ? "Editar Mi Pin" : "Sumarme"}
                </Button>
              }
              onPreviousData={setPrevDataExists}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HelpModal;
