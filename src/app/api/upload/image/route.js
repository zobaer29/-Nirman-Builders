import { NextResponse } from "next/server";
import { getAuthPayload } from "@/lib/auth";

const FALLBACK_IMGBB_KEY = "51e1c3568d8444bbe2b2dfaf15d7934d";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.IMGBB_API_KEY || FALLBACK_IMGBB_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ImgBB API key is missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadData = new FormData();
    uploadData.append("image", buffer.toString("base64"));
    uploadData.append("name", file.name?.replace(/\.[^/.]+$/, "") || "profile");

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok || !data?.success || !data?.data?.url) {
      return NextResponse.json(
        {
          error:
            data?.error?.message || "Failed to upload image to ImgBB",
        },
        { status: uploadRes.status || 502 }
      );
    }

    return NextResponse.json(
      {
        url: data.data.url,
        displayUrl: data.data.display_url || data.data.url,
        deleteUrl: data.data.delete_url || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
