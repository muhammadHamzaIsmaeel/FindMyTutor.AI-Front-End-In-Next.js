"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useUser();
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cookieRole = document.cookie.split("; ").find(r => r.startsWith("role="))?.split("=")[1];
    setRole(cookieRole || (user?.unsafeMetadata?.role as string));
  }, [user]);

  const isTeacher = role === "teacher";

  return (
    <header className="flex justify-between items-center px-4 md:px-6 h-16 shadow-sm bg-white">
      <Link href="/" className="text-2xl font-bold text-indigo-600">FindMyTutor.AI</Link>
      <nav className="flex gap-2 items-center">
        <Link href="/find">
          <Button variant="ghost" className="text-indigo-600 hover:bg-indigo-100">Find Tutors</Button>
        </Link>
        {isTeacher && (
          <Link href="/tutor-dashboard">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Dashboard</Button>
          </Link>
        )}
        <SignedOut>
          <SignInButton>
            <Button variant="outline" className="text-indigo-600 border-indigo-600 hover:bg-indigo-100">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button className="bg-green-600 text-white hover:bg-green-700">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
