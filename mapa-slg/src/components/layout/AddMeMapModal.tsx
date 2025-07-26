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
  addToast,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import AddMeMap from "./AddMeMap";
import ImageDropzone from "../common/ImageDropzone";
import { useState } from "react";
import { addMeMapService } from "@/api/auth";

const AddMeMapModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    setValue,
    getValues,
    formState: { errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<IUserMapRegistration>();
  const [loading, setLoading] = useState(false);

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("location.lat", lat);
    setValue("location.lng", lng);
    return { lat, lng };
  };

  const onSubmit = async (data: IUserMapRegistration) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Image from ImageDropzone (stored as File)
      if (data.profileImage?.[0])
        formData.append("profileImage", data.profileImage[0]);

      formData.append("description", data.description || "");
      formData.append("location.lat", String(data.location.lat));
      formData.append("location.lng", String(data.location.lng));

      await addMeMapService(formData);

      addToast({
        title: "Te has registrado en el mapa",
        description: "Ahora podrás ver tu ubicación en el mapa del san chulo.",
        color: "success",
      });
      reset();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addToast({
        title: "Error al registrarte en el mapa",
        description:
          error.message + " Por favor, intenta nuevamente más tarde.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
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
                  onSubmit={handleSubmit(onSubmit)}
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
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  isDisabled={loading}
                  form="add-me-map-form"
                >
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
