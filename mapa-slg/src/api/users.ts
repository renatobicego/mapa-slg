import { siteConfig } from "@/app/config";
import { getFileUrl } from "@/lib/getFiIeUrl";
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
    const usersWithProfileImage = await Promise.all(
      data.data.users.map(async (user: IUserProfile) => ({
        ...user,
        profileImage: await getFileUrl(user.profileImage),
      }))
    );
    return {
      ...data.data,
      users: usersWithProfileImage,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
