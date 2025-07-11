export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "student" | "teacher" | "employee";
  graduationYear?: number;
  workStartYear?: number;
  workEndYear?: number;
  isCurrentlyWorking?: boolean;
}

export interface IUserLogin {
  email: string;
  password: string;
}
