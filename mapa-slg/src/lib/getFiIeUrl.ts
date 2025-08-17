import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebaseStorage";

export const getFileUrl = async (
  filePath: string | undefined
): Promise<string> => {
  if (!filePath) return "";
  const fileUrl = ref(storage, filePath);
  return await getDownloadURL(fileUrl);
};
