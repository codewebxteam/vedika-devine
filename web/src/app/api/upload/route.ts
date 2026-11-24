import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ImageKit Upload API",
    endpoint: "https://ik.imagekit.io/xnkeog5gb",
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileName =
      (formData.get("fileName") as string) || `vedika_${Date.now()}.jpg`;
    const folder =
      (formData.get("folder") as string) || "/vedika-devine/products";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload." },
        { status: 400 }
      );
    }

    const privateKey =
      process.env.IMAGEKIT_PRIVATE_KEY || "private_SqQxC/gdV2F/DalHj7a+O4ortr4=";
    const auth = Buffer.from(`${privateKey}:`).toString("base64");

    const ikFormData = new FormData();
    ikFormData.append("file", file as any);
    ikFormData.append("fileName", fileName);
    ikFormData.append("folder", folder);
    ikFormData.append("useUniqueFileName", "true");

    const response = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: ikFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("ImageKit upload error response:", data);
      return NextResponse.json(
        { error: data.message || "Failed to upload image to ImageKit." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      fileId: data.fileId,
      name: data.name,
      filePath: data.filePath,
      size: data.size,
    });
  } catch (error: any) {
    console.error("Upload API route caught error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during upload." },
      { status: 500 }
    );
  }
}
