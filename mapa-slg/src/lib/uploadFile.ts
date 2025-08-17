import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseStorage";

import Compressor from "compressorjs";

export const compress = async (
  file: File,
  quality: number,
  maxHeight: number,
  maxWidth: number,
  convertSize?: number
): Promise<File | Blob> => {
  return await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxHeight,
      maxWidth,
      convertSize,
      success: resolve,
      error: reject,
    });
  });
};

export async function uploadFileAndGetUrl(file: File): Promise<string> {
  const extension =
    file instanceof File ? `.${file.name.split(".").pop()}` : "";
  const filename = `imagenes-perfil/${Date.now()}${extension}`;
  const storageRef = ref(storage, filename);

  const compressFile = await compress(file, 0.8, 800, 800);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, compressFile);
  return snapshot.ref.fullPath;
}
