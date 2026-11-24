export interface ImageKitUploadResult {
  success: boolean;
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  filePath?: string;
  size?: number;
}

export async function uploadToImageKit(
  file: File | Blob,
  fileName?: string,
  folder: string = "/vedika-divine/products"
): Promise<ImageKitUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "fileName",
    fileName || (file instanceof File ? file.name : `candle_${Date.now()}.jpg`)
  );
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to upload image to ImageKit CDN.");
  }

  return data as ImageKitUploadResult;
}
