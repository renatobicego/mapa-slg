import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/index.js";

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    description: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Por favor proporciona una dirección de email válida",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^\+?[\d\s\-\(\)]+$/,
        "Por favor proporciona un número de teléfono válido",
      ],
    },
    profileImage: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "El rol es obligatorio"],
      enum: {
        values: ["exstudent", "teacher", "employee", "student"],
        message: "El rol debe ser alumno, profesor o profesional no docente",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        default: [],
        validate: {
          validator: function (coordinates: number[]) {
            if (!coordinates || coordinates.length === 0) return true; // allow empty
            return (
              coordinates.length === 2 &&
              coordinates[0] >= -180 &&
              coordinates[0] <= 180 &&
              coordinates[1] >= -90 &&
              coordinates[1] <= 90
            );
          },
          message:
            "Las coordenadas deben ser [longitud, latitud] con rangos válidos",
        },
      },
    },

    // Student-specific fields
    graduationYear: {
      type: Number,
      required: function (this: IUserDocument) {
        return this.role === "exstudent";
      },
      min: [1900, "Ingrese un año válido"],
      max: [new Date().getFullYear(), "Ingrese un año válido"],
    },

    // Teacher/Employee-specific fields
    workStartYear: {
      type: Number,
      required: function (this: IUserDocument) {
        return this.role === "teacher" || this.role === "employee";
      },
      min: [1900, "Ingrese un año válido"],
      max: [new Date().getFullYear(), "Ingrese un año válido"],
    },
    workEndYear: {
      type: Number,
      validate: {
        validator: function (this: IUserDocument, value: number) {
          if (this.isCurrentlyWorking && value) {
            return false; // Cannot have end year if currently working
          }
          if (value && this.workStartYear && value < this.workStartYear) {
            return false; // End year cannot be before start year
          }
          return true;
        },
        message:
          "El año de fin de trabajo debe ser posterior al año de inicio y no puede establecerse si está trabajando actualmente",
      },
    },
    isCurrentlyWorking: {
      type: Boolean,
      default: function (this: IUserDocument) {
        return this.role === "teacher" || this.role === "employee";
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: { password?: string }) {
        if (ret.password !== undefined) {
          delete ret.password;
        }
        return ret;
      },
    },
  }
);

UserSchema.index({ location: "2dsphere" }, { sparse: true });

// Validation for role-specific fields
UserSchema.pre("validate", function (next) {
  if (this.role === "exstudent" && !this.graduationYear) {
    this.invalidate(
      "graduationYear",
      "El año de egreso es obligatorio para ex-alumnos"
    );
  }

  if (
    (this.role === "teacher" || this.role === "employee") &&
    !this.workStartYear
  ) {
    this.invalidate(
      "workStartYear",
      "El año de inicio de trabajo es obligatorio para profesores y profesionales no docentes"
    );
  }

  next();
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
