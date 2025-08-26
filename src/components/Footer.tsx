import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      {" "}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {" "}
        <div>
          {" "}
          <h3 className="text-2xl font-bold mb-4">FindMyTutor.AI</h3>{" "}
          <p className="text-gray-400">
            Connecting students and tutors with ease.
          </p>{" "}
        </div>{" "}
        <div className="flex gap-6 mt-6 md:mt-0">
          {" "}
          <Link
            href="/about"
            className="text-gray-400 hover:text-white transition"
          >
            About
          </Link>{" "}
          <Link
            href="/contact"
            className="text-gray-400 hover:text-white transition"
          >
            Contact
          </Link>{" "}
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-white transition"
          >
            Privacy Policy
          </Link>{" "}
        </div>{" "}
      </div>{" "}
      <p className="text-center text-gray-400 mt-8">
        © 2025 FindMyTutor.AI. All rights reserved.
      </p>{" "}
    </footer>
  );
}
