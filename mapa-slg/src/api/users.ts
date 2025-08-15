import { siteConfig } from "@/app/config";
import { IUserProfile } from "@/types/types";
import axios from "axios";

export const getUsersService = async (): Promise<{
  users: IUserProfile[];
  totalUsers: number;
}> => {
  try {
    const { data } = await axios.get(`${siteConfig.serverUrl}/users`, {
      fetchOptions: {
        cache: "no-cache",
      },
    });
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
