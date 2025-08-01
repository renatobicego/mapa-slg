import express from "express";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";
import { getFileUrl } from "../lib/firebase/getFileUrl.js";

const router = express.Router();

// Get all users
router.get("/", async (_req: AuthRequest, res) => {
  try {
    // remove password, email and phone from the response
    // and return only the necessary user information
    const users = await User.find().select("-password -email -phone");

    const total = await User.countDocuments();

    const usersWithProfileUrlImage = users.map((user) => {
      const userObject = user.toObject();
      return {
        ...userObject,
        profileImage: getFileUrl(userObject.profileImage),
      };
    });

    res.json({
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: {
        users: usersWithProfileUrlImage,
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Get user by ID
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Usuario obtenido exitosamente",
      user,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;
