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

export const getUserProfileService = async (
  token: string
): Promise<IUserProfile> => {
  try {
    const { data } = await axios.get(`${siteConfig.serverUrl}/auth/profile`, {
      fetchOptions: {
        cache: "no-cache",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      ...data.user,
      profileImage:
        data.user.profileImage && (await getFileUrl(data.user.profileImage)),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteImageService = async (token: string) => {
  try {
    const { data } = await axios.delete(
      `${siteConfig.serverUrl}/auth/profile/image`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
