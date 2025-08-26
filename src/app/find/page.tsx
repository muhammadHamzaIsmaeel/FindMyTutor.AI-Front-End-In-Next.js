'use client';

import { useState } from 'react';
import TutorCard from '@/components/TutorCard';
import { findTutor } from '@/lib/api';
import { Loader2, Search } from 'lucide-react';


export default function FindPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const data = await findTutor(query);
    setResults(data.matchingTutors || []);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">
        Find Your Perfect Tutor 🎓
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Search tutors by subject, location, or requirements. Get the right teacher to help you succeed.
      </p>

      {/* Search Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-12">
        <div className="flex-grow relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Male Math tutor in Nazimabad for home tuition"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Search'}
        </button>
      </form>

      {/* Results */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center col-span-full text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          results.map((tutor, idx) => (
            <TutorCard key={idx} tutor={tutor} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No tutors found. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
}
