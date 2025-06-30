import { IUserRegistration } from "@/types/types";
import axios, { AxiosError } from "axios";

export const registerUserService = async (payload: IUserRegistration) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      payload
    );
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};
