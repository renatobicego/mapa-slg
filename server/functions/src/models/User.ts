import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
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
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
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
        values: ["student", "teacher", "employee"],
        message: "El rol debe ser estudiante, profesor o empleado",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
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
        return this.role === "student";
      },
      min: [1900, "El año de graduación debe ser posterior a 1900"],
      max: [
        new Date().getFullYear() + 20,
        "El año de graduación no puede ser más de 20 años en el futuro",
      ],
    },

    // Teacher/Employee-specific fields
    workStartYear: {
      type: Number,
      required: function (this: IUserDocument) {
        return this.role === "teacher" || this.role === "employee";
      },
      min: [1900, "El año de inicio de trabajo debe ser posterior a 1900"],
      max: [
        new Date().getFullYear(),
        "El año de inicio de trabajo no puede ser en el futuro",
      ],
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

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Validation for role-specific fields
UserSchema.pre("validate", function (next) {
  if (this.role === "student" && !this.graduationYear) {
    this.invalidate(
      "graduationYear",
      "El año de graduación es obligatorio para estudiantes"
    );
  }

  if (
    (this.role === "teacher" || this.role === "employee") &&
    !this.workStartYear
  ) {
    this.invalidate(
      "workStartYear",
      "El año de inicio de trabajo es obligatorio para profesores y empleados"
    );
  }

  next();
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
