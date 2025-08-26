// components/TutorCard.tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { MdVerified } from "react-icons/md";


export default function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Profile Image */}
      <div className="relative w-full h-48">
        {tutor.photo ? (
          <Image
            src={urlFor(tutor.photo).url()}
            alt={tutor.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <Image
            src="/favicon.ico"
            alt="default"
            fill
            className="object-cover"
          />
        )}

        {/* ✅ Verified Tick */}
        {tutor.verified && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MdVerified className="text-white" /> Verified
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="text-lg text-black font-semibold flex items-center gap-2">
          {tutor.name}
        </h2>
        <p className="text-gray-600">{tutor.subject}</p>
        <p className="text-sm text-gray-500">
          {tutor.mode} • {tutor.experience || 0} yrs
        </p>

        {/* Bio */}
        {tutor.bio && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{tutor.bio}</p>
        )}

        {/* ✅ View Profile Button */}
        {tutor.slug?.current && (
          <Link href={`/tutor/${tutor.slug.current}`}>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              View Profile
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}