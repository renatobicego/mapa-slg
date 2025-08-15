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
import {
  authenticateToken,
  validateFrontendToken,
  AuthRequest,
} from "../middleware/auth.js";
import { Document } from "mongoose";
import multer from "multer";
import path from "path";
import { uploadFileAndGetUrl } from "../utils/firebase/uploadFIle.js";
import { deleteFile } from "../utils/firebase/deleteFile.js";
import sharp from "sharp";

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
        password: userData.password,
        role: userData.role,
        phone: userData.phone?.trim(),
      };

      // Add role-specific fields
      if (userData.role === "exstudent") {
        userToCreate.graduationYear = userData.graduationYear;
      } else if (userData.role === "teacher" || userData.role === "employee") {
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
router.get("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      message: "Perfil obtenido exitosamente",
      user: req.user!.toJSON(),
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/profile",
  authenticateToken,
  upload.single("profileImage"),
  async (req: AuthRequest, res) => {
    try {
      const updates = req.body;
      const user = req.user!;

      // Remove sensitive fields
      delete updates.password;
      delete updates.email;
      delete updates._id;

      // Handle profile image upload (optional)
      if (req.file) {
        const extension = path.extname(req.file.originalname);
        const filename = `imagenes-perfil/${
          user.name
        }-${Date.now()}${extension}`;
        const compressedBuffer = await sharp(req.file.buffer)
          .resize(800, 800, { fit: "inside" })
          .jpeg({ quality: 70 })
          .withMetadata()
          .toBuffer();
        const imageUrl = await uploadFileAndGetUrl(
          compressedBuffer,
          filename,
          req.file.mimetype
        );

        if (user.profileImage) {
          // Delete previous image if it exists
          await deleteFile(user.profileImage);
        }
        updates.profileImage = imageUrl; // Add image URL to updates
      }

      const location = {
        coordinates: [
          parseFloat(updates["location.lng"]),
          parseFloat(updates["location.lat"]),
        ],
        type: "Point",
      };

      // Update fields
      Object.assign(user, { ...updates, location });
      await user.save();

      return res.json({
        success: true,
        message: "Perfil actualizado exitosamente",
        user: user.toJSON(),
      });
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);

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
        message:
          "Error interno del servidor durante la actualización del perfil",
      });
    }
  }
);

export default router;
