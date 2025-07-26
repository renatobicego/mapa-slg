import { bucket } from "./init"; // your initialized bucket

export async function uploadFileAndGetUrl(
  buffer: Buffer,
  destinationPath: string,
  contentType?: string
): Promise<string> {
  const file = bucket.file(destinationPath);

  const stream = file.createWriteStream({
    metadata: {
      contentType,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      console.error("Upload error:", err);
      reject(err);
    });

    stream.on("finish", async () => {
      // Option 1: Make public and return public URL
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      resolve(publicUrl);
    });

    stream.end(buffer);
  });
}
