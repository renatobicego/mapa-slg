import React, { memo } from "react";
import { IUserProfile } from "@/types/types";
import { Chip, Image, Modal, ModalBody, ModalContent } from "@heroui/react";
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
    const maxWSize =
      screenSize.width && screenSize.width < 768 ? "max-w-5xl" : "max-w-xl";
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

    const getColorDotByRole = (role: string) => {
      switch (role) {
        case "student":
          return "bg-red/80";
        case "exstudent":
          return "bg-dark-blue/80";
        case "teacher":
          return "bg-light-blue/80";
        case "employee":
          return "bg-green/80";
        case "familia":
          return "bg-yellow/80";
        default:
          return "bg-black/80";
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
        scrollBehavior="inside"
      >
        <ModalContent className="p-0 ">
          <ModalBody className="flex flex-col items-start p-0 relative ">
            <Image
              src={profileImage ? profileImage : undefined}
              alt={name}
              className={`${
                !profileImage && "hidden"
              } object-cover w-full mx-auto bg-white h-full max-h-[70vh]`}
              removeWrapper
            />

            <div className={`flex flex-col gap-2 px-4 py-2 w-full ${maxWSize}`}>
              <h3 className="heading-3 sticky top-0 left-0">{name}</h3>
              <div className="flex flex-wrap gap-2 mb-2 w-full">
                {getRoleLabels().map((role, index) => (
                  <Chip
                    size="sm"
                    variant="dot"
                    className={`${getColorByRole(role.role)}`}
                    classNames={{
                      dot: `${getColorDotByRole(role.role)}`,
                    }}
                    key={index}
                  >
                    {role.label}
                  </Chip>
                ))}
              </div>
              <p className={`!text-small break-all`}>{description}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

InfoWindowContent.displayName = "InfoWindowContent";
