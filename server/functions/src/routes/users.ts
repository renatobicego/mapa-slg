import express from "express";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/", async (_req: AuthRequest, res) => {
  try {
    // remove password, email and phone from the response
    // and return only the necessary user information
    const users = await User.find().select("-password -email -phone");

    const total = await User.countDocuments();

    res.json({
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: {
        users: users,
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

    return res.json({
      success: true,
      message: "Usuario obtenido exitosamente",
      user,
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

export default router;
