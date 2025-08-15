"use client";
import { IUserLogin } from "@/types/types";
import { Card, CardHeader, CardBody, Alert, Form, Link } from "@heroui/react";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
import { siteConfig } from "@/app/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserLogin>();
  const onSubmit = async (data: IUserLogin) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      } else {
        // Redirect to the home page or wherever you want after successful login
        router.push(siteConfig.pages.home);
      }
    } catch {
      setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-2 items-start">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert color="danger">{error}</Alert>}

          <div className="w-full flex flex-col gap-0">
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
              showGrouped
              position="top"
              isRequired
              placeholder="Ingresá tu email"
              label="Email"
              errorMessage={errors.email?.message}
            />

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
              isRequired
              showGrouped
              position="bottom"
              placeholder="Ingresa tu contraeña"
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
          </div>
          <Button
            type="submit"
            className="w-full"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          <p className="text-sm text-gray-600">
            ¿No tenés una cuenta? {""}
            <Link href={siteConfig.pages.register}>Registrate</Link>
          </p>
        </Form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
