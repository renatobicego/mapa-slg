export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  description?: string;
  role: "exstudent" | "teacher" | "employee";
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Student-specific fields
  graduationYear?: number;

  // Teacher/Employee-specific fields
  workStartYear?: number;
  workEndYear?: number;
  isCurrentlyWorking?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  description?: string;
  profileImage?: string;
  role: "exstudent" | "teacher" | "employee" | "student";
  graduationYear?: number;
  workStartYear?: number;
  workEndYear?: number;
  isCurrentlyWorking?: boolean;
  location?: {
    longitude: number;
    latitude: number;
  };
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface ITokenValidation {
  token: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
  token?: string;
  user?: Omit<IUser, "password">;
}
