import { createClient } from "@/lib/supabase/client";

function getUniqueFileName(file: File) {
  const extension = file.name.split(".").pop();
  const fileNameWithoutExtension = file.name.replace(`.${extension}`, "");
  const formattedFileName = fileNameWithoutExtension
    .replaceAll(" ", "-")
    .replaceAll("_", "")
    .replaceAll(".", "-");

  return `${formattedFileName}_${crypto.randomUUID().slice(0, 5)}.${extension}`;
}

export async function uploadFile(file: File, filePath?: string) {
  if (!file) return;

  const supabase = createClient();
  const bytes = await file.arrayBuffer();
  const bucket = supabase.storage.from("assets");

  const fileName = filePath ?? getUniqueFileName(file);

  const mimeType = file.type; // Get the MIME type from the file object

  const { error } = await bucket.upload(fileName, bytes, {
    upsert: true,
    contentType: mimeType,
  });

  if (error) {
    console.log("Error uploading file:", error);
    throw error;
  }

  return bucket.getPublicUrl(fileName).data.publicUrl;
}

export async function downloadFile(path: string) {
  const supabase = createClient();
  const bucket = supabase.storage.from("assets");
  const { data, error } = await bucket.download(path);

  if (error) {
    console.log("Error downloading file:", error);
  } else {
    console.log("File downloaded:", data);
  }
}
