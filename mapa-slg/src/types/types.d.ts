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

export interface IUserMapRegistration {
  location: {
    lat: number;
    lng: number;
  };
  description?: string;
  profileImage: FileList | null;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export type AvatarData = {
  id: string;
  src: string;
  alt?: string;
};
