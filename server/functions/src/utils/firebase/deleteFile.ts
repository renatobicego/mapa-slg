import { bucket } from "./init";

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const file = bucket.file(filePath);
    await file.delete();
    console.log(`File ${filePath} deleted successfully.`);
  } catch (error: any) {
    console.error(`Error deleting file ${filePath}:`, error);
    throw new Error(`Error al borrar la imagen anterior: ${error.message}`);
  }
};
