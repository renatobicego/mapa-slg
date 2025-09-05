import React, { memo } from "react";
import { IUserProfile } from "@/types/types";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ScrollShadow,
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
    return (
      <Modal
        size={modalSize}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="p-0"
        placement="center"
        classNames={{
          closeButton: "z-50 bg-black text-white",
        }}
      >
        <ModalContent className="p-0 ">
          <ModalBody className="flex flex-col items-center p-0 relative ">
            <Image
              src={`${profileImage ? profileImage : "/default-avatar.webp"}`}
              alt={name}
              className="object-cover w-full mx-auto bg-white h-full"
              removeWrapper
            />
          </ModalBody>
          <ModalFooter className="flex-col">
            <h3 className="heading-4 sticky top-0 left-0 mb-1">{name}</h3>
            <ScrollShadow size={16} className="w-full min-h-8 max-h-32">
              <p className="!text-small">{description}</p>
            </ScrollShadow>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

InfoWindowContent.displayName = "InfoWindowContent";
