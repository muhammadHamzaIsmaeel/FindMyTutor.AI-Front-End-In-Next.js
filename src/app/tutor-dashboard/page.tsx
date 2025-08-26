"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import ProfileForm from "@/components/tutor/ProfileForm";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useCallback } from "react";
import { FormData } from "@/types/FormData";


export default function TutorDashboard() {
  const { user, isSignedIn } = useUser();
  const [profile, setProfile] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cookieRole = document.cookie.split("; ").find(r => r.startsWith("role="))?.split("=")[1];
    setRole(cookieRole || (user?.unsafeMetadata?.role as string));
  }, [user]);

  useEffect(() => {
    if (user && role === "teacher") fetchProfile();
  }, [user, role]);

  const fetchProfile = useCallback(async () => {
  setLoading(true);
  const q = `*[_type=="tutor" && userId==$uid][0]{name, subject, gender, mode, experience, bio, contact, education, address, "slug": slug.current}`;
  const data = await client.fetch(q, { uid: user?.id });
  setProfile(data);
  setLoading(false);
  if (!data) setEditMode(true);
  }, [user?.id]);

  useEffect(() => {
    if (user && role === "teacher") fetchProfile();
  }, [user, role, fetchProfile]);

  if (!isSignedIn) return <RedirectToSignIn />;

  if (role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4 text-gray-600">Only teachers can access the tutor dashboard.</p>
      </div>
    );
  }

  if (loading) return <Loader2 className="animate-spin mx-auto mt-20" size={48} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-600">Your Tutor Dashboard 🎓</h1>

        {editMode ? (
          <ProfileForm onSave={() => { setEditMode(false); fetchProfile(); }} initialData={profile} />
        ) : profile ? (
          <Card className="shadow-lg">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Your Profile</CardTitle>
              <div className="flex gap-3">
                {profile?.slug && (
                  <Link href={`/tutor/${profile.slug}`} target="_blank">
                    <Button variant="outline">View Public Profile</Button>
                  </Link>
                )}
                <Button onClick={() => setEditMode(true)} className="bg-indigo-600 text-white">Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Subject:</strong> {profile.subject}</p>
              <p><strong>Gender:</strong> {profile.gender}</p>
              <p><strong>Mode:</strong> {profile.mode}</p>
              <p><strong>Experience:</strong> {profile.experience} years</p>
              <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
              <p><strong>Contact:</strong> {profile.contact}</p>
              {profile.education && (
                <div className="pt-2">
                  <p className="font-semibold">Education</p>
                  <p>{profile.education.highestDegree} in {profile.education.field}</p>
                  <p>{profile.education.institute} — {profile.education.graduationYear}</p>
                </div>
              )}
              {profile.address && (
                <div className="pt-2">
                  <p className="font-semibold">Address</p>
                  <p>{profile.address.addressLine}</p>
                  <p>{profile.address.area}, {profile.address.city} {profile.address.postalCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-600">No profile yet. Click edit to create one.</p>
        )}
      </div>
    </div>
  );
}