export type RoleEnum =
  | "exstudent"
  | "teacher"
  | "employee"
  | "student"
  | "familia";
export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: RoleEnum[];
  graduationYear?: number;
  workStartYear?: number;
  workEndYear?: number;
  isCurrentlyWorking?: boolean;
}

type BaseUser = {
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
};

type ExStudentProfile = BaseUser & {
  role: ("exstudent" | "student")[]; // can include both
  graduationYear: number;
};

type StudentProfile = BaseUser & {
  role: ("student" | "familia")[];
};

type TeacherEmployeeProfile = BaseUser & {
  role: ("teacher" | "employee")[];
  workStartYear: number;
  workEndYear?: number;
  isCurrentlyWorking?: boolean;
};

export type IUserProfile =
  | ExStudentProfile
  | StudentProfile
  | TeacherEmployeeProfile;

export interface IUserMapRegistration {
  location: {
    lat: number;
    lng: number;
  };
  description?: string;
  profileImage?: FileList | null;
  defaultProfileImage?: string;
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
