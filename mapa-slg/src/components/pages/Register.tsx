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
  Link,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { EyeOff, Eye } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { siteConfig } from "@/app/config";
import { registerUserService } from "@/api/auth";
import { AxiosError } from "axios";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
      role: undefined,
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
      const response = await registerUserService(data);

      if (!response.success) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fallo el registro");
      }

      // Redirect to login page or dashboard
      router.push(siteConfig.pages.login);
    } catch (err) {
      setError(
        err instanceof AxiosError
          ? err.response?.data.message
          : "Ocurrió un error"
      );
      if (err instanceof AxiosError) {
        err.response?.data.errors?.forEach(
          ({ path, msg }: { path: keyof IUserRegistration; msg: string }) => {
            setFormError(path as keyof IUserRegistration, {
              type: "manual",
              message: msg,
            });
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-2 items-start">
        <h1 className="text-2xl font-bold text-center">Crear Perfil</h1>
        <p className="text-center">Ingresá tu información para registrarte</p>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <Alert color="danger">{error}</Alert>}

          {/* Basic Information */}
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="text-lg font-medium">Datos Personales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                id="name"
                {...register("name", {
                  required: "El nombre es requerido",
                })}
                errorMessage={errors.name?.message}
                placeholder="Ingresá tu nombre completo"
                label="Nombre Completo"
              />

              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email incorrecto",
                  },
                })}
                placeholder="Ingresá tu email"
                label="Email"
                description="Luego iniciarás sesión con tu email"
                errorMessage={errors.email?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                })}
                placeholder="Ingresa tu contraeña"
                description="La contraseña debe tener al menos 8 caracteres"
                endContent={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    isIconOnly
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                }
                errorMessage={errors.password?.message}
                label="Contraseña"
              />

              <Input
                id="phone"
                {...register("phone")}
                placeholder="Ingresá tu telefono"
                label="Telefono"
              />
            </div>

            {/* <Textarea
                id="description"
                {...register("description")}
                placeholder="Cuentanos sobre ti"
                label="Descripción"
                className="min-h-[100px]"
                labelPlacement="outside"
              /> */}

            {/* <div className="flex flex-col gap-2 items-start">
                <label htmlFor="profileImage" className="text-sm">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="bordered"
                    onPress={() =>
                      document.getElementById("profileImage")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Comparte tu foto
                  </Button>
                </div>
              </div>*/}
          </div>

          {/* Role Selection */}
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="text-lg font-medium">Tu relación con la escuela</h3>

            <Controller
              name="role"
              control={control}
              rules={{ required: "El rol es requerido" }}
              render={({ field }) => (
                <Select
                  onChange={field.onChange}
                  value={field.value}
                  label="¿Cuál es tu relación con la escuela?"
                  placeholder="Selecciona tu relación"
                  description="Puede ser relación actual o pasada"
                  labelPlacement="outside"
                  radius="lg"
                  errorMessage={errors.role?.message}
                  className="flex-1"
                  isInvalid={errors.role ? true : false}
                >
                  <SelectItem key="student">Alumno</SelectItem>
                  <SelectItem key="teacher">Profesor</SelectItem>
                  <SelectItem key="employee">Personal no docente</SelectItem>
                </Select>
              )}
            />

            {/* Conditional Fields Based on Role */}
            {selectedRole === "student" && (
              <Input
                id="graduationYear"
                type="number"
                {...register("graduationYear", {
                  validate: (value) => {
                    if (!selectedRole) return true;
                    return selectedRole === "student" && !value
                      ? "El año de graduación es obligatorio para estudiantes"
                      : true;
                  },
                  min: {
                    value: 1900,
                    message: "Ingresá un año válido",
                  },
                  max: {
                    value: new Date().getFullYear() + 20,
                    message: "Ingresá un año válido",
                  },
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: "Debe ser un año válido de 4 dígitos",
                  },
                })}
                placeholder="por ejemplo, 2025"
                label="Año de egreso"
                pattern="^[0-9]{4}$"
                min={1900}
                max={new Date().getFullYear() + 20}
                description="Si todavía no te has egresado, ingresa el año en el que lo harías"
                errorMessage={errors.graduationYear?.message}
              />
            )}

            {(selectedRole === "teacher" || selectedRole === "employee") && (
              <div className="flex flex-col gap-4 items-start w-full">
                <Controller
                  name="isCurrentlyWorking"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isCurrentlyWorking"
                      checked={field.value}
                      size="sm"
                      onChange={field.onChange}
                    >
                      Estoy trabajando actualmente
                    </Checkbox>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Input
                    id="workStartYear"
                    type="number"
                    {...register("workStartYear", {
                      min: {
                        value: 1900,
                        message: "Debe ser posterior a 1900",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "No puede ser un año futuro",
                      },
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: "Debe ser un año válido de 4 dígitos",
                      },
                    })}
                    placeholder="por ejemplo, 2025"
                    label="¿Desde qué año?"
                    pattern="^[0-9]{4}$"
                    errorMessage={errors.workStartYear?.message}
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
                        min: {
                          value: 1900,
                          message: "Debe ser posterior a 1900",
                        },
                        max: {
                          value: new Date().getFullYear(),
                          message: "No puede ser un año futuro",
                        },
                        pattern: {
                          value: /^[0-9]{4}$/,
                          message: "Debe ser un año válido de 4 dígitos",
                        },
                      })}
                      placeholder="por ejemplo, 2025"
                      label="Hasta qué año?"
                      pattern="^[0-9]{4}$"
                      errorMessage={errors.workEndYear?.message}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Crendo..." : "Crear Perfil"}
          </Button>

          <p className="text-sm text-gray-600">
            ¿Ya tenés una cuenta? {""}
            <Link href={siteConfig.pages.login}>Inicia sesión</Link>
          </p>
        </Form>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;
