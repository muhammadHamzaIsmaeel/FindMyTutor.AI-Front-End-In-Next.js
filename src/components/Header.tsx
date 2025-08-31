"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const role = user?.unsafeMetadata?.role as string | undefined;
  const isTeacher = role === "teacher";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white text-black shadow-md">
      {/* Left side Logo */}
      <Link href="/" className="text-2xl font-bold">
        FindMyTutor.AI
      </Link>

      {/* Right side Menu */}
      <nav className="flex items-center space-x-6">

        {isTeacher && (
          <Link href="/tutor-dashboard">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Dashboard
            </Button>
          </Link>
        )}

        {/* User Auth Buttons */}
        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            Sign Up
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>
    </header>
  );
}
