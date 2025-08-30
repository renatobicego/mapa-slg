"use client";

import { IUserMapRegistration } from "@/types/types";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Form,
  addToast,
  ButtonProps,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import AddMeMap from "./AddMeMap";
import ImageDropzone from "../common/ImageDropzone";
import { cloneElement, useCallback, useEffect, useState } from "react";
import { addMeMapService } from "@/api/auth";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import useMediaQuery from "@/hooks/useMediaQuery";
import Button from "../common/Button";
import { PlusIcon } from "lucide-react";
import { getUserProfileService } from "@/api/users";

const AddMeMapModal = ({
  button,
  onPreviousData,
}: {
  button?: React.ReactElement<ButtonProps>;
  onPreviousData?: (prevDataExists: boolean) => void;
}) => {
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
  const { getToken, isSignedIn } = useAuth();

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      setValue("location.lat", lat);
      setValue("location.lng", lng);
      return { lat, lng };
    },
    [setValue]
  );

  const onSubmit = async (data: IUserMapRegistration) => {
    try {
      if (!data.location?.lat || !data.location?.lng) {
        addToast({
          title: "Error al registrarte en el mapa",
          description: "Por favor, selecciona una ubicación en el mapa.",
          color: "danger",
        });
        return;
      }
      setLoading(true);

      const token = await getToken();
      if (!token) throw new Error("Usuario no autenticado");
      await addMeMapService(data, token);

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

  const getDefaultValues = useCallback(async () => {
    const token = await getToken();
    if (token) {
      try {
        const userProfile = await getUserProfileService(token);
        setValue("description", userProfile.description || "");
        if (userProfile.location?.coordinates.length === 2) {
          handleLocationChange(
            userProfile.location.coordinates[1],
            userProfile.location.coordinates[0]
          );
          onPreviousData?.(true);
        }
        setValue("defaultProfileImage", userProfile.profileImage || "");
      } catch {
        addToast({
          title: "Error al cargar tu perfil",
          description: "Error al traer tus datos cargados. Intenta nuevamente.",
          color: "danger",
        });
      }
    }
  }, [getToken, handleLocationChange, onPreviousData, setValue]);

  useEffect(() => {
    getDefaultValues();
  }, [getDefaultValues]);

  const screenSize = useMediaQuery();
  const modalSize = screenSize.width && screenSize.width < 768 ? "full" : "5xl";

  const clonedButton = button
    ? cloneElement(
        button,
        isSignedIn
          ? {
              onClick: () => {
                console.log("[v0] Modal opening via cloned button");
                onOpen();
              },
            }
          : {}
      )
    : null;
  return (
    <>
      <SignedIn>
        {clonedButton ?? (
          <Button
            startContent={<PlusIcon className="size-5" />}
            onPress={onOpen}
          >
            Sumate
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        <SignInButton>
          {clonedButton ?? (
            <Button startContent={<PlusIcon className="size-5" />}>
              Sumate
            </Button>
          )}
        </SignInButton>
      </SignedOut>
      <Modal
        placement="center"
        scrollBehavior="inside"
        size={modalSize}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sumate al Mapa del San Lucho
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
                      defaultImage={getValues("defaultProfileImage")}
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
                <Button
                  variant="light"
                  className="bg-transparent text-black"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  isDisabled={loading}
                  form="add-me-map-form"
                >
                  Sumarme
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
