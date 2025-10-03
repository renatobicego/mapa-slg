import React, { memo } from "react";
import { IUserProfile } from "@/types/types";
import {
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import useMediaQuery from "@/hooks/useMediaQuery";

type InfowindowContentProps = {
  data: {
    isLeaf: true;
    data: IUserProfile;
  } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const InfoWindowContent = memo(
  ({ isOpen, onOpenChange, data }: InfowindowContentProps) => {
    const { data: user } = data || {};
    const { name, profileImage, description } = user || {};
    const screenSize = useMediaQuery();
    const modalSize = screenSize.width && screenSize.width < 768 ? "5xl" : "xl";
    const getRoleLabels = () => {
      if (!user || !Array.isArray(user.role)) {
        return [{ role: "community", label: "Miembro de la Comunidad" }];
      }

      return user.role.map((role) => {
        switch (role) {
          case "student":
            return { role, label: "Alumno/a" };
          case "familia":
            return { role, label: "Familia" };

          case "exstudent": {
            const year =
              "graduationYear" in user && user.graduationYear
                ? ` - Promoción ${user.graduationYear}`
                : "";
            return { role, label: `Ex Alumno/a${year}` };
          }

          case "teacher": {
            const workYears =
              "workStartYear" in user && user.workStartYear
                ? user.isCurrentlyWorking
                  ? ` - Desde ${user.workStartYear}`
                  : user.workEndYear
                  ? ` - Desde ${user.workStartYear} a ${user.workEndYear}`
                  : ` - Desde ${user.workStartYear}`
                : "";
            return { role, label: `Docente${workYears}` };
          }

          case "employee": {
            const workYears2 =
              "workStartYear" in user && user.workStartYear
                ? user.isCurrentlyWorking
                  ? ` - Desde ${user.workStartYear}`
                  : user.workEndYear
                  ? ` - Desde ${user.workStartYear} a ${user.workEndYear}`
                  : ` - Desde ${user.workStartYear}`
                : "";
            return { role, label: `Personal No Docente${workYears2}` };
          }

          default:
            return { role: "community", label: "Miembro de la Comunidad" };
        }
      });
    };

    const getColorByRole = (role: string) => {
      switch (role) {
        case "student":
          return "text-red border-red/80";
        case "exstudent":
          return "text-dark-blue border-dark-blue/80";
        case "teacher":
          return "text-light-blue border-light-blue/80";
        case "employee":
          return "text-green border-green/80";
        case "familia":
          return "text-yellow border-yellow/80";
        default:
          return "text-black border-black/80";
      }
    };
    return (
      <Modal
        size={modalSize}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="p-0"
        placement="center"
        classNames={{
          closeButton:
            "z-50 bg-black text-white hover:bg-black/80 cursor-pointer",
        }}
      >
        <ModalContent className="p-0 ">
          <ModalBody className="flex flex-col items-center p-0 relative ">
            <Image
              src={`${profileImage ? profileImage : "/default-avatar.webp"}`}
              alt={name}
              className="object-cover w-full mx-auto bg-white h-full max-h-[70vh] "
              removeWrapper
            />
          </ModalBody>
          <ModalFooter className="flex-col max-h-[30dvh] overflow-y-auto">
            <h3 className="heading-4 sticky top-0 left-0 mb-1">{name}</h3>
            {getRoleLabels().map((role, index) => (
              <Chip
                size="sm"
                variant="dot"
                className={`${getColorByRole(role.role)}`}
                key={index}
              >
                {role.label}
              </Chip>
            ))}
            <p className="!text-small">{description}</p>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

InfoWindowContent.displayName = "InfoWindowContent";
