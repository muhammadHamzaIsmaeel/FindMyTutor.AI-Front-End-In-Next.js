"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const role = user?.unsafeMetadata?.role as string | undefined;
  const isTeacher = role === "teacher";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white text-black shadow-md sticky top-0 z-50">
      {/* Left side Logo */}
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        FindMyTutor.AI
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/find" className="border-gray-300 text-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800 p-2 rounded-full">
          Find Tutors
        </Link>
        {isTeacher && (
          <Link href="/tutor-dashboard">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Dashboard
            </Button>
          </Link>
        )}

        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </nav>

      {/* Mobile Menu with Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-white">
            <div className="flex flex-col space-y-4 mt-6">
              {isTeacher && (
                <Link href="/tutor-dashboard">
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    Dashboard
                  </Button>
                </Link>
              )}

              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
                >
                  Sign Up
                </Link>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
