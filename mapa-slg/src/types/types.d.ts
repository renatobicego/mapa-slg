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

export type IUserProfile =
  | {
      _id: string;
      name: string;
      email: string;
      phone?: string;
      profileImage?: string;
      description?: string;
      location: {
        type: "Point";
        coordinates: [number, number];
      };
    } & (
      | {
          role: "student";
          graduationYear: number;
        }
      | {
          role: "teacher" | "employee";
          workStartYear: number;
          workEndYear?: number;
          isCurrentlyWorking?: boolean;
        }
    );

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
