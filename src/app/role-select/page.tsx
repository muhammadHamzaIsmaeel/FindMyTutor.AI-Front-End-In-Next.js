"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RoleSelectPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) router.replace("/sign-in");
  }, [isSignedIn, router]);

  const handleRoleSelect = async (role: "student" | "teacher") => {
    setLoading(true);
    try {
      await user?.update({ unsafeMetadata: { role } });
      document.cookie = `role=${role}; path=/; max-age=31536000; SameSite=Lax`;
      router.push(role === "teacher" ? "/tutor-dashboard" : "/");
    } catch (e: unknown) {
      console.error("Role update failed:", e);
      alert("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-4xl font-bold mb-10 text-indigo-600">Choose Your Role</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="flex flex-col items-center text-center p-10">
            <User2 className="w-16 h-16 text-indigo-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-3">I am a Student</h2>
            <p className="text-gray-600 mb-6">Search and connect with the best tutors.</p>
            <Button onClick={() => handleRoleSelect("student")} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3">
              {loading ? <Loader2 className="animate-spin" /> : "Continue as Student"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="flex flex-col items-center text-center p-10">
            <GraduationCap className="w-16 h-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-3">I am a Tutor</h2>
            <p className="text-gray-600 mb-6">Create your profile and start teaching.</p>
            <Button onClick={() => handleRoleSelect("teacher")} disabled={loading} className="bg-green-600 text-white hover:bg-green-700 px-6 py-3">
              {loading ? <Loader2 className="animate-spin" /> : "Continue as Tutor"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}