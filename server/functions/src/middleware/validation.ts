import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRegistration = [
  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Por favor proporciona un número de teléfono válido"),

  body("profileImage").optional(),

  // Student-specific validation
  body("graduationYear")
    .if(body("role").equals("exstudent"))
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Ingrese un año válido"),

  // Teacher/Employee-specific validation
  body("workStartYear")
    .if(body("role").isIn(["teacher", "employee"]))
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Ingrese un año válido"),

  body("workEndYear")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Ingrese un año válido"),

  body("isCurrentlyWorking")
    .optional()
    .isBoolean()
    .withMessage("El estado de trabajo actual debe ser verdadero o falso"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Por favor proporciona una dirección de email válida"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const validateToken = [
  body("token")
    .notEmpty()
    .withMessage("El token es obligatorio")
    .isJWT()
    .withMessage("El token debe tener un formato válido"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: errors.array(),
    });
  }

  next();
  return;
};
