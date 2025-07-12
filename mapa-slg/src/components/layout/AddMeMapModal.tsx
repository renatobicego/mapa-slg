"use client";

import { IUserMapRegistration } from "@/types/types";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Form,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import AddMeMap from "./AddMeMap";
import ImageDropzone from "../common/ImageDropzone";

const AddMeMapModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    setValue,
    getValues,
    formState: { errors },
    register,
    control,
  } = useForm<IUserMapRegistration>();

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("location.lat", lat);
    setValue("location.lng", lng);
    return { lat, lng };
  };
  return (
    <>
      <Button onPress={onOpen}>Cargate en el mapa</Button>
      <Modal
        placement="center"
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cargate en el mapa del san chulo
              </ModalHeader>
              <ModalBody>
                <Form
                  id="add-me-map-form"
                  className="flex lg:flex-row flex-col gap-4 items-stretch"
                >
                  <div className="flex flex-col gap-4 flex-1 ">
                    <ImageDropzone
                      setValue={setValue}
                      errors={errors}
                      control={control}
                    />
                    <Textarea
                      label="Descripción"
                      placeholder="Escribe una breve descripción sobre ti"
                      {...register("description")}
                      errorMessage={errors.description?.message}
                      labelPlacement="outside"
                      radius="lg"
                      classNames={{
                        inputWrapper: "flex-1",
                      }}
                      lang="es"
                      className="flex-1"
                      isInvalid={!!errors.description}
                    />
                  </div>
                  <AddMeMap
                    handleLocationChange={handleLocationChange}
                    lat={getValues("location.lat")}
                    lng={getValues("location.lng")}
                  />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" type="submit" form="add-me-map-form">
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMeMapModal;
