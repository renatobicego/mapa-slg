import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import * as functions from "firebase-functions";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import { clerkMiddleware } from "@clerk/express";
// Load environment variables
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3001;

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());
app.use(clerkMiddleware());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://mapaslg100.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // permitir solicitudes sin origen (ej: Postman)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("No permitido por CORS"));
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "El servidor está funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Manejador global de errores:", err);

    res.status(err.status || 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "¡Algo salió mal!"
          : err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// app.listen(3001, () => {
//   console.log(`🚀 Servidor ejecutándose en el puerto ${3001}`);
//   console.log(`🏥 Verificación de salud: http://localhost:${3001}/health`);
// });

export const api = functions.https.onRequest(app);
// export default app;
