import { bucket } from "./init";

export const getFileUrl = (filePath?: string): string => {
  if (!filePath) {
    return "";
  }

  // Assuming the filePath is a relative path to the Firebase storage bucket
  const file = bucket.file(filePath);
  return file.publicUrl();
};
