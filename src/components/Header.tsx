import React from "react";
import Link from "next/link";

export default function Header({ onLogoClick }: { onLogoClick?: () => void }) {
  const broadcasterSignupLink = "https://chaturbate.com/in/?tour=NwNd&campaign=RCJNu&track=default";
  const signupLink = "https://chaturbate.com/in/?tour=3Mc9&campaign=RCJNu&track=default&redirect_to_room=-welcomepage-";
  
  return (
    <header className="bg-zinc-950 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
        <div className="w-full flex flex-row items-center gap-1 md:w-auto md:gap-3">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold tracking-wide text-pink-500 cursor-pointer flex-shrink-0"
            style={{ zIndex: 2 }}
            onClick={onLogoClick}
          >
            TSLive
          </Link>
          <div className="flex flex-row gap-1 md:gap-2 ml-auto">
            <a
              href={broadcasterSignupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 md:px-6 md:py-1 rounded font-semibold text-xs md:text-base bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-pink-500 hover:text-white transition-all duration-150"
              style={{ whiteSpace: "nowrap" }}
            >
              Go Live Yourself
            </a>
            <a
              href={signupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 md:px-6 md:py-1 rounded font-semibold text-xs md:text-base bg-pink-500 text-white border border-pink-500 hover:bg-pink-600 transition-all duration-150"
              style={{ whiteSpace: "nowrap" }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
      <div
        className="w-screen bg-gradient-to-r from-zinc-800/60 via-zinc-700/80 to-zinc-800/60"
        style={{
          minHeight: "1px",
          height: "1px",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)"
        }}
        aria-hidden="true"
      />
    </header>
  );
}