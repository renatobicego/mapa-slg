import React, { memo } from "react";
import { IUserProfile } from "@/types/types";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

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
    const isLeaf = data?.isLeaf ?? false;
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            {isLeaf ? (
              <p>hola</p>
            ) : (
              <div className="flex flex-col">
                <p>chau</p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

InfoWindowContent.displayName = "InfoWindowContent";
