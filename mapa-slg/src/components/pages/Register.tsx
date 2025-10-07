"use client";
import { IUserRegistration } from "@/types/types";
import {
  Card,
  CardHeader,
  Alert,
  Select,
  SelectItem,
  Checkbox,
  CardBody,
  Form,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { useForm, Controller } from "react-hook-form";
import { siteConfig } from "@/app/config";
import { registerUserService } from "@/api/auth";
import { AxiosError } from "axios";
import { useUser } from "@clerk/nextjs";
import { completeOnboarding } from "@/app/bienvenida/_actions";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm<IUserRegistration>({
    defaultValues: {
      role: [],
      isCurrentlyWorking: false,
    },
  });

  const selectedRole = watch("role");
  const isCurrentlyWorking = watch("isCurrentlyWorking");
  const workStartYear = watch("workStartYear");

  const onSubmit = async (data: IUserRegistration) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await registerUserService({
        ...data,
        email: user?.emailAddresses[0].emailAddress || data.email,
        name: user?.fullName || data.name,
        workEndYear:
          data.workEndYear && !isNaN(data.workEndYear)
            ? data.workEndYear
            : undefined,
      });

      if (!response.success) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fallo el registro");
      }

      // Redirect to login page or dashboard
      await completeOnboarding();
      await user?.reload();
      router.push(siteConfig.pages.login);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Ocurrió un error"
      );
      if (err instanceof AxiosError) {
        err.response?.data.errors?.forEach(
          ({
            path,
            msg,
            field,
            message,
          }: {
            path: keyof IUserRegistration;
            msg: string;
            field: keyof IUserRegistration;
            message: string;
          }) => {
            console.log(path, msg);
            setFormError((path ?? field) as keyof IUserRegistration, {
              type: "manual",
              message: msg || message,
            });
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl font-(family-name:--font-montserrat)">
      <CardHeader className="flex flex-col gap-2 items-start">
        <h1 className="text-2xl font-bold text-center">Bienvenido/a</h1>
        <p className="text-center">Últimos pasos para completar su registro</p>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert color="danger">{error}</Alert>}

          <Input
            id="phone"
            {...register("phone", {
              validate: (value) => {
                if (!value) return true;
                return (
                  /^\+?[0-9\s]+$/.test(value) || "Número de teléfono inválido"
                );
              },
            })}
            label="Teléfono"
            placeholder="Teléfono"
            type="tel"
            description="Opcional, pero recomendado"
            pattern="^\+?[0-9\s]+$"
            errorMessage={errors.phone?.message}
            isInvalid={!!errors.phone}
          />

          {/* Role Selection */}
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="text-lg font-medium">Tu relación con la escuela</h3>

            <Controller
              name="role"
              control={control}
              rules={{ required: "El rol es requerido" }}
              render={({ field }) => (
                <Select
                  selectedKeys={new Set(field.value ?? [])}
                  onSelectionChange={(keys) => {
                    field.onChange(Array.from(keys));
                  }}
                  label="¿Cuál es tu relación con la escuela?"
                  placeholder="Selecciona tu relación"
                  description="Puede ser relación actual o pasada"
                  labelPlacement="outside"
                  radius="lg"
                  selectionMode="multiple"
                  errorMessage={errors.role?.message}
                  className="flex-1"
                  isInvalid={!!errors.role}
                  disabledKeys={[
                    field.value.includes("student") ? "exstudent" : "",
                    field.value.includes("exstudent") ? "student" : "",
                  ]}
                >
                  <SelectItem key="student">Alumno</SelectItem>
                  <SelectItem key="exstudent">Ex-Alumno</SelectItem>
                  <SelectItem key="teacher">Profesor</SelectItem>
                  <SelectItem key="employee">Personal no docente</SelectItem>
                  <SelectItem key="familia">Familia</SelectItem>
                </Select>
              )}
            />

            {/* Conditional Fields Based on Role */}
            {selectedRole?.includes("exstudent") && (
              <>
                <h4 className="text-lg font-medium">¿Cuándo egresaste?</h4>
                <Input
                  id="graduationYear"
                  type="number"
                  {...register("graduationYear", {
                    validate: (value) => {
                      if (!selectedRole) return true;
                      return selectedRole.includes("exstudent") && !value
                        ? "El año de egreso es obligatorio para ex-alumnos"
                        : true;
                    },
                    valueAsNumber: true,
                    min: {
                      value: 1900,
                      message: "Ingrese un año válido",
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: "Ingrese un año válido",
                    },
                  })}
                  placeholder="por ejemplo, 2025"
                  label="Año de egreso"
                  pattern="^[0-9]{4}$"
                  min={1900}
                  max={new Date().getFullYear()}
                  errorMessage={errors.graduationYear?.message}
                />
              </>
            )}

            {(selectedRole?.includes("teacher") ||
              selectedRole?.includes("employee")) && (
              <div className="flex flex-col gap-4 items-start w-full">
                <h4 className="text-lg font-medium">
                  Tu recorrido en la escuela como profesor o personal no docente
                </h4>

                <Input
                  id="workStartYear"
                  type="number"
                  {...register("workStartYear", {
                    min: {
                      value: 1900,
                      message: "Ingrese un año válido",
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: "Ingrese un año válido",
                    },
                    valueAsNumber: true,
                  })}
                  placeholder="por ejemplo, 2025"
                  label="¿Desde qué año?"
                  pattern="^[0-9]{4}$"
                  errorMessage={errors.workStartYear?.message}
                />

                <Controller
                  name="isCurrentlyWorking"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isCurrentlyWorking"
                      isSelected={field.value}
                      size="md"
                      onChange={field.onChange}
                    >
                      Estoy trabajando actualmente
                    </Checkbox>
                  )}
                />
                {!isCurrentlyWorking && (
                  <Input
                    id="workEndYear"
                    type="number"
                    {...register("workEndYear", {
                      validate: (value) => {
                        if (!workStartYear || !value) return true; // wait until start year is filled
                        return (
                          value >= workStartYear ||
                          "Debe ser mayor o igual al año de inicio"
                        );
                      },
                      valueAsNumber: true,
                      min: {
                        value: 1900,
                        message: "Ingrese un año válido",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "Ingrese un año válido",
                      },
                    })}
                    placeholder="por ejemplo, 2025"
                    label="¿Hasta qué año?"
                    pattern="^[0-9]{4}$"
                    errorMessage={errors.workEndYear?.message}
                  />
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : "Crear Perfil"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;
