import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, School, UserCheck, Calendar, Briefcase } from "lucide-react";
import { MdVerified } from "react-icons/md";

export default async function TutorPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const q = `*[_type=="tutor" && slug.current==$slug][0]{
    name,
    subject,
    gender,
    mode,
    experience,
    bio,
    contact,
    education,
    address,
    photo,
    "verified": verified
  }`;

  const data = await client.fetch(q, { slug });
  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* HERO HEADER SECTION */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-90"></div>
          <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Image */}
            {data.photo && (
              <div className="flex-shrink-0">
                <Image
                  src={urlFor(data.photo).url()}
                  alt={data.name}
                  width={180}
                  height={180}
                  className="rounded-full border-4 border-white shadow-xl transform transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            {/* Tutor Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-extrabold flex items-center gap-3 mb-3">
                {data.name}
                {data.verified && (
                  <MdVerified className="text-yellow-300 text-3xl" />
                )}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
                Expert {data.subject} Tutor
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-1 text-sm font-medium">
                  {data.gender}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-1 text-sm font-medium">
                  {data.mode} Mode
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white px-4 py-1 text-sm font-medium flex items-center gap-1">
                  <Briefcase size={14} />
                  {data.experience}+ Years
                </Badge>
              </div>
              <Button
                className="bg-yellow-400 text-teal-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:-translate-y-1"
                asChild
              >
                <a
                  href={`https://wa.me/${data.contact?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get in Touch
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN: ABOUT, EDUCATION */}
          <div className="lg:col-span-2 space-y-8">
            {/* ABOUT SECTION */}
            {data.bio && (
              <Card className="rounded-3xl shadow-lg border-none overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-blue-50 p-6 md:p-8">
                  <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <UserCheck className="text-teal-600" size={28} />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <p className="text-gray-800 leading-relaxed text-lg">{data.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* EDUCATION SECTION */}
            {data.education && (
              <Card className="rounded-3xl shadow-lg border-none overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-blue-50 p-6 md:p-8">
                  <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <School className="text-teal-600" size={28} />
                    Education Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-4">
                  <p className="text-xl font-semibold text-gray-800">
                    {data.education.highestDegree} in {data.education.field}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 text-lg">
                    <Calendar className="text-teal-600" size={20} />
                    {data.education.institute} • Graduated {data.education.graduationYear}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: CONTACT, ADDRESS */}
          <div className="space-y-8">
            {/* CONTACT CARD */}
            <Card className="rounded-3xl shadow-lg border-none overflow-hidden sticky top-24 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-blue-50 p-6 md:p-8">
                <CardTitle className="text-2xl md:text-3xl font-bold">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                {data.contact && (
                  <div className="flex items-center gap-4 text-gray-800 text-lg">
                    <Mail className="text-teal-600 flex-shrink-0" size={24} />
                    <span className="break-all">{data.contact}</span>
                  </div>
                )}
                {data.address?.city && (
                  <div className="flex items-center gap-4 text-gray-800 text-lg">
                    <MapPin className="text-teal-600 flex-shrink-0" size={24} />
                    <span>{data.address.city}</span>
                  </div>
                )}
                {data.contact && (
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    asChild
                  >
                    <a
                      href={`https://wa.me/${data.contact?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Message on WhatsApp
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* ADDRESS CARD */}
            {data.address && (
              <Card className="rounded-3xl shadow-lg border-none overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-blue-50 p-6 md:p-8">
                  <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <MapPin className="text-teal-600" size={28} />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <p className="text-gray-800 text-lg mb-2">{data.address.addressLine}</p>
                  <p className="text-gray-800 text-lg">
                    {data.address.area}, {data.address.city} {data.address.postalCode}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}