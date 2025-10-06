import express from "express";
import jwt from "jsonwebtoken";
import { IUserDocument, User } from "../models/User.js";
import { Request, Response } from "express";
import {
  IUserRegistration,
  IUserLogin,
  IAuthResponse,
  ITokenValidation,
} from "../types/index.js";
import {
  validateRegistration,
  validateLogin,
  validateToken,
  handleValidationErrors,
} from "../middleware/validation.js";
import { validateFrontendToken } from "../middleware/auth.js";
import { Document } from "mongoose";
import { deleteFile } from "../utils/firebase/deleteFile.js";
import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import { log } from "firebase-functions/logger";
import { hasRole } from "../utils/utils.js";

const router = express.Router();

// Register a new user
router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  async (
    req: Request<{}, {}, IUserRegistration>,
    res: Response<IAuthResponse>
  ) => {
    try {
      const userData: IUserRegistration = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Ya existe un usuario con este email",
        });
      }

      // Create user object
      const userToCreate: any = {
        name: userData.name,
        email: userData.email.trim(),
        role: userData.role,
        phone: userData.phone?.trim(),
      };

      // Add role-specific fields
      if (hasRole(userData.role, "exstudent")) {
        userToCreate.graduationYear = userData.graduationYear;
      }
      if (
        hasRole(userData.role, "teacher") ||
        hasRole(userData.role, "employee")
      ) {
        userToCreate.workStartYear = userData.workStartYear;
        userToCreate.workEndYear = userData.workEndYear;
        userToCreate.isCurrentlyWorking = userData.isCurrentlyWorking ?? true;
      }

      // Create and save user
      const user = new User(userToCreate);
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      const response: IAuthResponse = {
        success: true,
        message: "Usuario registrado exitosamente",
        token,
        user: user.toJSON(),
      };

      return res.status(201).json(response);
    } catch (error: any) {
      console.error("Error de registro:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        success: false,
        message: "Error interno del servidor durante el registro",
      });
    }
  }
);

// Login user
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  async (req: Request<{}, {}, IUserLogin>, res: Response<IAuthResponse>) => {
    try {
      const { email, password }: IUserLogin = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email o contraseña incorrectos",
        });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Email o contraseña incorrectos",
        });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      const response: IAuthResponse = {
        success: true,
        message: "Inicio de sesión exitoso",
        token,
        user: user.toJSON(),
      };

      res.json(response);
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor durante el inicio de sesión",
      });
    }
    // Ensure a return statement in all code paths
    return;
  }
);

// Validate token from frontend
router.post(
  "/validate-token",
  validateToken,
  handleValidationErrors,
  validateFrontendToken,
  async (
    req: Request<
      {},
      {},
      ITokenValidation & {
        validatedUser: Document<unknown, {}, IUserDocument, {}> &
          IUserDocument &
          Required<{
            _id: string;
          }> & {
            __v: number;
          };
      }
    >,
    res: Response<IAuthResponse>
  ) => {
    try {
      const user = req.body.validatedUser;

      res.json({
        success: true,
        message: "Token válido",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Error de validación de token:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor durante la validación del token",
      });
    }
  }
);

// Get current user profile
router.get("/profile", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId || "");

    const userProfile = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!userProfile) {
      res.status(404).json({
        success: false,
        message: "Perfil no encontrado",
      });
    } else {
      res.json({
        success: true,
        message: "Perfil obtenido exitosamente",
        user: userProfile.toJSON(),
      });
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

router.put("/profile", requireAuth(), async (req, res) => {
  try {
    const updates = req.body;
    log("Actualizando perfil con datos:", updates);
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId as string);

    const userProfile = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Perfil no encontrado",
      });
    }
    const profileImage = req.body.profileImageUrl;

    if (profileImage) {
      if (userProfile.profileImage) {
        await deleteFile(userProfile.profileImage);
      }

      updates.profileImage = profileImage;
    }

    const location = {
      coordinates: [Number(updates.location.lng), Number(updates.location.lat)],
      type: "Point",
    };

    Object.assign(userProfile, { ...updates, location });
    await userProfile.save();

    return res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: userProfile.toJSON(),
    });
  } catch (error: any) {
    console.error("Error al actualizar perfil:", req.body);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor durante la actualización del perfil",
    });
  }
});

router.delete("/profile/image", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId as string);

    const userProfile = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Perfil no encontrado",
      });
    }

    if (!userProfile.profileImage) {
      return res.status(404).json({
        success: false,
        message: "Imagen de perfil no encontrada",
      });
    }

    if (userProfile.profileImage) {
      await deleteFile(userProfile.profileImage);
    }

    Object.assign(userProfile, { profileImage: undefined });
    await userProfile.save();

    return res.json({
      success: true,
      message: "Imagen de perfil eliminada exitosamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar perfil:", req.body);
    return res.status(500).json({
      success: false,
      message:
        "Error interno del servidor durante la eliminación de la imagen de perfil",
    });
  }
});

export default router;
