"use client";

import type React from "react";
import type { IUserMapRegistration } from "@/types/types";
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
  type ButtonProps,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import AddMeMap from "./AddMeMap";
import ImageDropzone from "../common/ImageDropzone";
import { cloneElement, useCallback, useEffect, useState } from "react";
import { addMeMapService } from "@/api/auth";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PlusIcon } from "lucide-react";
import { getUserProfileService } from "@/api/users";
import Button from "../common/Button";

const AddMeMapModal = ({
  button,
  onPreviousData,
  prevDataExists,
  setShouldFetch,
}: {
  button?: React.ReactElement<ButtonProps>;
  onPreviousData?: (prevDataExists: boolean) => void;
  prevDataExists?: boolean;
  setShouldFetch?: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [step, setStep] = useState<1 | 2>(1); // track current step
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
      if (setShouldFetch) setShouldFetch(true);

      addToast({
        title: "Te has registrado en el mapa",
        description: "Ahora podrás ver tu ubicación en el mapa del San Lucho.",
        color: "success",
      });
      reset();
      setStep(1); // reset step
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
                setStep(1);
                onOpen();
              },
            }
          : {}
      )
    : null;

  const handleClose = () => {
    if (step === 2) {
      const confirmCancel = window.confirm(
        "¿Estás seguro de que quieres cancelar tu registro?"
      );
      if (!confirmCancel) return;
    }
    setStep(1);
    onClose();
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!getValues("location.lat") || !getValues("location.lng")) {
      addToast({
        title: "Selecciona una ubicación",
        description: "Debes elegir un lugar en el mapa antes de continuar.",
        color: "danger",
      });
      return;
    }
    setStep(2);
  };

  return (
    <>
      <SignedIn>
        {clonedButton ?? (
          <Button className="flex items-center gap-2">
            <PlusIcon className="size-5" />
            Sumate
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        <SignInButton>
          {clonedButton ?? (
            <Button className="flex items-center gap-2">
              <PlusIcon className="size-5" />
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
          <ModalHeader className="flex flex-col gap-1">
            {prevDataExists ? "Editar Mi Pin" : "Sumate al Mapa del San Lucho"}
          </ModalHeader>
          <ModalBody>
            <div className="flex lg:flex-row flex-col gap-4 items-stretch">
              {step === 1 && (
                <AddMeMap
                  handleLocationChange={handleLocationChange}
                  lat={getValues("location.lat")}
                  lng={getValues("location.lng")}
                />
              )}

              {step === 2 && (
                <Form
                  id="add-me-map-form"
                  className="flex flex-col gap-4 flex-1"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
                    classNames={{ inputWrapper: "flex-1" }}
                    lang="es"
                    className="flex-1"
                    isInvalid={!!errors.description}
                  />
                </Form>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="text-black bg-transparent" onPress={handleClose}>
              Cerrar
            </Button>

            {step === 1 ? (
              <Button onClick={handleContinue}>Continuar</Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                isDisabled={loading}
                isLoading={loading}
                form="add-me-map-form"
              >
                {loading
                  ? "Cargando..."
                  : prevDataExists
                  ? "Actualizar"
                  : "Sumarme"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMeMapModal;
