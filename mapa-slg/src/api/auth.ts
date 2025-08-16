import { siteConfig } from "@/app/config";
import { IUserRegistration } from "@/types/types";
import axios, { AxiosError } from "axios";

export const registerUserService = async (payload: IUserRegistration) => {
  try {
    const { data } = await axios.post(
      `${siteConfig.serverUrl}/auth/register`,
      payload
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

export const addMeMapService = async (formData: FormData, token: string) => {
  try {
    const { data } = await axios.put(
      `${siteConfig.serverUrl}/auth/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
