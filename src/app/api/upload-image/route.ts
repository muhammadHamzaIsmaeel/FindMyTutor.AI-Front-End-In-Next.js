import { client } from '@/sanity/lib/serverClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const asset = await client.assets.upload("image", buffer, {
      filename: file.name,
    });

    return NextResponse.json({ assetId: asset._id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Image upload failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Image upload failed with unknown error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
