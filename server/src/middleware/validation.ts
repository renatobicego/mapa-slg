import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Por favor proporciona una dirección de email válida"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Por favor proporciona un número de teléfono válido"),

  body("role")
    .isIn(["student", "teacher", "employee"])
    .withMessage("El rol debe ser estudiante, profesor o empleado"),

  body("profileImage").optional(),

  // Student-specific validation
  body("graduationYear")
    .if(body("role").equals("student"))
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage(
      "El año de graduación debe estar entre 1900 y 10 años en el futuro"
    ),

  // Teacher/Employee-specific validation
  body("workStartYear")
    .if(body("role").isIn(["teacher", "employee"]))
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      "El año de inicio de trabajo debe estar entre 1900 y el año actual"
    ),

  body("workEndYear")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      "El año de fin de trabajo debe estar entre 1900 y el año actual"
    ),

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
};
