import express from "express";
import { User } from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";
import { SortOrder } from "mongoose";

const router = express.Router();

// Get all users
router.get("/", async (req: AuthRequest, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (role && ["student", "teacher", "employee"].includes(role as string)) {
      query.role = role;
    }

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { createdAt: -1 as SortOrder },
    };

    const users = await User.find(query)
      .select("-password")
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: {
        users,
        pagination: {
          currentPage: options.page,
          totalPages: Math.ceil(total / options.limit),
          totalUsers: total,
          hasNext: options.page < Math.ceil(total / options.limit),
          hasPrev: options.page > 1,
        },
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
