import { client } from '@/sanity/lib/serverClient';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      userId, name, subject, gender, mode, experience, bio, contact,
      education, address, photo
    } = data;

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const slug = slugify(String(name || ''), { lower: true, strict: true });

    const doc = {
      _type: 'tutor',
      _id: userId,
      userId,
      name,
      subject: subject?.toLowerCase(),
      gender,
      mode,
      experience,
      bio,
      contact,
      education,
      address,
      location: address?.area || address?.city,
      slug: { _type: 'slug', current: slug },
      ...(photo ? { photo: { _type: "image", asset: { _type: "reference", _ref: photo } } } : {}),
    };
    
    await client.createOrReplace(doc);

    return NextResponse.json({ message: 'Profile saved successfully', slug }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error saving profile:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
  }
}
