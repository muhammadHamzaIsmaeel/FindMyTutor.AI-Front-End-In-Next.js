"use client";

import { useState, useEffect } from "react";
import TutorCard from "@/components/TutorCard";
import { findTutor } from "@/lib/api";
import { Loader2, ArrowRight, BookOpen, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isSignedIn) {
      const cookieRole = document.cookie.split("; ").find(r => r.startsWith("role="))?.split("=")[1];
      setRole(cookieRole || (user?.unsafeMetadata?.role as string));
    }
  }, [isSignedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const data = await findTutor(query);
    setResults(data.matchingTutors || []);
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-24 px-6 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Find Your Perfect Tutor with AI 🚀</h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            Discover top tutors for any subject or join as a teacher to inspire students.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-12 space-y-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Male math tutor in Nazimabad for home tuition"
              className="w-full p-4 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 transition"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-indigo-900 hover:bg-yellow-500 px-6 py-4 rounded-lg font-semibold transition"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Search Tutors"}
            </Button>
          </form>

          {/* No sign-up CTA here anymore; explore/search only */}
          {(!loading && results.length === 0 && query === "") && (
            <Link href="/find">
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold">
                Explore Tutors <ArrowRight className="ml-2" />
              </Button>
            </Link>
          )}

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto px-6">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : results.length > 0 ? (
              results.map((tutor, idx) => <TutorCard key={idx} tutor={tutor} />)
            ) : (
              query && <p className="text-white">No tutors found. Try a different search.</p>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-indigo-600 mx-auto" />
                <CardTitle className="text-xl font-semibold">Search Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Enter your requirements and find the best tutors instantly.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <Users className="w-12 h-12 text-indigo-600 mx-auto" />
                <CardTitle className="text-xl font-semibold">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Contact tutors via WhatsApp or email to schedule sessions.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <Star className="w-12 h-12 text-indigo-600 mx-auto" />
                <CardTitle className="text-xl font-semibold">Learn & Grow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Start learning with personalized sessions and achieve goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}