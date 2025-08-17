import { siteConfig } from "@/app/config";
import { uploadFileAndGetUrl } from "@/lib/uploadFile";
import { IUserMapRegistration, IUserRegistration } from "@/types/types";
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

export const addMeMapService = async (
  formData: IUserMapRegistration,
  token: string
) => {
  try {
    const newData: IUserMapRegistration & { profileImageUrl?: string } = {
      ...formData,
    };
    if (formData.profileImage?.[0]) {
      newData.profileImageUrl = await uploadFileAndGetUrl(
        formData.profileImage[0]
      );
    }
    delete newData.profileImage;
    const { data } = await axios.put(
      `${siteConfig.serverUrl}/auth/profile`,
      newData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};
