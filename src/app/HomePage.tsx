"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Model } from "@/types/model";
import { chaturbateCountries } from '@/utils/countries';
import CountryDropdown from "@/components/CountryDropdown";
import AgeDropdown from "@/components/AgeDropdown";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const genderMap: { [key: string]: string } = {
  Trans: "t",
};

const fetchModelBatch = async (
  offset: number,
  limit: number,
  genderCode: string | null
): Promise<Model[]> => {
  let url = `https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=RCJNu&format=json&limit=${limit}&offset=${offset}&client_ip=request_ip`;
  if (genderCode) url += `&gender=t`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
};

const getAffiliateModelLink = (username: string) => {
  const campaign = "RCJNu";
  const tour = "LQps";
  const track = "tslive";
  return `https://chaturbate.com/${username}/?campaign=${campaign}&tour=${tour}&track=${track}&join_overlay=1&signup_notice=1&room=${username}`;
};

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const [selectedGender] = useState<string>("Trans");
  const [models, setModels] = useState<Model[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [topTags, setTopTags] = useState<string[]>([]);
  const [tagsReady, setTagsReady] = useState(false);
  const modelsPerPage = 20;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/trans") {
      router.replace("/trans");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    setModels([]);
    setHasMore(true);
    setTagsReady(false);
    setTopTags([]);
    let isMounted = true;
    const genderCode = genderMap[selectedGender];

    const fetchAllModels = async () => {
      let offset = 0;
      let first = true;
      let keepFetching = true;
      let totalFetched = 0;
      while (keepFetching && isMounted) {
        const limit = first ? 50 : 500;
        const batch = await fetchModelBatch(offset, limit, genderCode);

        if (first && batch.length > 0) {
          batch.slice(0, 1).forEach((model, i) => {
            console.log(`test model ${i + 1}: ${model.chat_room_url}`);
          });
        }

        totalFetched += batch.length;
        if (batch.length > 0) {
          if (first) {
            setModels(batch);
            setLoading(false);
            // Tag logic
            const tagCounts: Record<string, number> = {};
            batch.forEach(model => {
              if (Array.isArray(model.tags)) {
                model.tags.forEach(tag => {
                  tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
              }
            });
            const tags = Object.entries(tagCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 20)
              .map(([tag]) => tag);
            setTopTags(tags);
            setTagsReady(true);
            first = false;
          } else {
            setModels(prev => [...prev, ...batch]);
          }
          offset += limit;
          if (batch.length < limit) keepFetching = false;
        } else {
          keepFetching = false;
          setHasMore(false);
        }
      }
      if (isMounted && first) setLoading(false);
    };
    fetchAllModels();
    return () => { isMounted = false; };
  }, [selectedGender]);

  const filteredModels = models.filter((model) => {
    if (selectedCountry && model.country !== selectedCountry) return false;
    if (model.age < minAge || model.age > maxAge) return false;
    if (searchQuery && !model.username.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTags.length > 0) {
      if (!Array.isArray(model.tags)) return false;
      if (!selectedTags.every(tag => model.tags.includes(tag))) return false;
    }
    return true;
  });

  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = filteredModels.slice(indexOfFirstModel, indexOfLastModel);
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);

  const countryCounts: { [country: string]: number } = models.reduce((acc, model) => {
    if (model.country) {
      acc[model.country] = (acc[model.country] || 0) + 1;
    }
    return acc;
  }, {} as { [country: string]: number });

  const handleAgeChange = (range: string) => {
    const [min, max] = range.split("-").map(Number);
    setMinAge(min);
    setMaxAge(max);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry, minAge, maxAge, searchQuery, selectedTags]);

  const description = {
    title: "Trans Live – Watch Shemales Show Off Everything",
    paragraphs: [
      "Click a picture and enter a world of hot trans girls who love being watched. Here, you’ll find beautiful shemales with firm breasts, hard cocks, and seductive lips – all live on cam.",
      "Whether you get off on a sexy trans girl playing with herself, sucking cock, or getting fucked in the ass – it’s all served raw and up close here.",
      "These trans models are real amateurs from all over the world who love showing off their bodies live. Some flirt, some dominate – and many want you to take control in chat.",
      "If you love the combo of tits and dick, naughty eyes and hungry attitude, you’re in the right place. Watch them live, chat, and get them to do everything you fantasize about.",
    ],
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSelectedCountry("");
    setMinAge(18);
    setMaxAge(100);
    setCurrentPage(1);
    setIsExpanded(false);
    setSearchQuery("");
    setSelectedTags([]);
    router.replace("/trans");
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const broadcasterSignupLink = "/api/redirect?to=" + encodeURIComponent("https://chaturbate.com/in/?tour=NwNd&campaign=RCJNu&track=default");
  const signupLink = "/api/redirect?to=" + encodeURIComponent("https://chaturbate.com/in/?tour=3Mc9&campaign=RCJNu&track=default&redirect_to_room=-welcomepage-");
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-950 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          <div className="w-full flex flex-row items-center gap-1 md:w-auto md:gap-3">
            <h1
              className="text-2xl md:text-3xl font-bold tracking-wide text-pink-500 cursor-pointer flex-shrink-0"
              onClick={resetFilters}
              style={{ zIndex: 2 }}
            >
              TSLive
            </h1>
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
                Create Free Account
              </a>
            </div>
          </div>
          <div className="w-full mt-3 md:mt-0 md:ml-8 md:mr-8 md:flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={() => setCurrentPage(1)}
            />
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
      <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-center py-2">
            <CountryDropdown
              countries={chaturbateCountries}
              selectedCountry={selectedCountry}
              onChange={setSelectedCountry}
              countryCounts={countryCounts}
            />
            <AgeDropdown minAge={minAge} maxAge={maxAge} onChange={handleAgeChange} />
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
        </div>
      {/* TAG FILTER ROW */}
      {tagsReady && !!topTags.length && (
      <div className="flex flex-wrap gap-2 items-center justify-center py-2 bg-zinc-900">
        {topTags.map((tag) => {
          const selected = selectedTags.includes(tag);
          const disabled = !selected && selectedTags.length >= 3;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              disabled={disabled}
              className={`px-3 py-1 rounded-full border transition-all duration-150
                ${selected ? "bg-pink-500 text-white border-pink-600"
                  : disabled ? "bg-zinc-800 text-zinc-400 border-zinc-800 opacity-40 cursor-not-allowed"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-pink-600 hover:text-white"}
              `}
              style={{ pointerEvents: disabled ? "none" : undefined }}
            >
              #{tag}
            </button>
          );
        })}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="ml-2 px-3 py-1 rounded-full bg-zinc-700 text-white border border-zinc-500"
          >
            Clear tag filter ✕
          </button>
        )}
      </div>
      )}
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
      {/* Optional Description Section */}
      {description && (
        <section className="bg-zinc-800 text-white px-6 py-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-pink-400 mb-4">{description.title}</h2>
            <div className="text-sm leading-6 text-zinc-300 space-y-4">
              {isExpanded
                ? description.paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
                : <p>{description.paragraphs[0]}</p>}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 text-sm text-pink-400 hover:underline border border-pink-500 px-2 py-1 rounded"
            >
              {isExpanded ? "Show less ▲" : "Show more ▼"}
            </button>
          </div>
        </section>
      )}

      {/* Main content */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-10"
        style={{ minHeight: "400px" }}
      >
        {loading ? (
          <p className="text-center text-pink-400 font-semibold">Loading models...</p>
        ) : filteredModels.length === 0 ? (
          <p className="text-center text-gray-400">No models found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {currentModels.map((model) => (
                <a
                  key={model.username}
                  href={`/api/redirect?to=${encodeURIComponent(getAffiliateModelLink(model.username))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                >
                  <div className="relative">
                    <img
                      src={model.image_url_360x270}
                      alt={model.display_name}
                      className="w-full h-44 object-cover"
                      style={{ minHeight: "176px", minWidth: "100%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  </div>
                  <div className="p-3 pb-10 space-y-2 relative z-10">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{model.username}</span>
                      <div className="flex items-center space-x-2 text-pink-400">
                        <span>{model.age}</span>
                        {model.country && (
                          <img
                            src={`https://flagcdn.com/24x18/${model.country.toLowerCase()}.png`}
                            alt={model.country}
                            className="w-5 h-auto rounded-sm"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </div>
                    {/* Show tags for each model */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.tags?.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="bg-zinc-700 text-xs px-2 py-0.5 rounded-full text-zinc-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-zinc-700 my-2"></div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-snug">{model.room_subject}</p>
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center text-xs text-zinc-400 bg-zinc-900 bg-opacity-75 px-2 py-1 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.68 1.662-1.196 2.385a11.954 11.954 0 01-1.786 1.987C16.268 16.057 14.477 17 12 17c-2.477 0-4.268-.943-5.56-2.628a11.954 11.954 0 01-1.786-1.987A11.954 11.954 0 012.458 12z"
                      />
                    </svg>
                    <span>{model.num_users}</span>
                  </div>
                  {typeof model.seconds_online === "number" && (
                    <div className="absolute bottom-2 left-2 bg-zinc-900 bg-opacity-75 rounded px-2 py-1 text-xs text-white flex items-center space-x-1 select-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-pink-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      </svg>
                      <span>
                        {(model.seconds_online / 3600).toFixed(1)} h
                      </span>
                    </div>
                  )}
                  {model.is_hd && (
                    <span className="absolute top-2 right-2 bg-pink-500 text-xs px-2 py-1 rounded font-bold">
                      HD
                    </span>
                  )}
                  {model.is_new && (
                    <span className="absolute top-2 left-2 bg-green-600 text-xs px-2 py-1 rounded font-bold">
                      NEW
                    </span>
                  )}
                </a>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 pt-4 border-t border-pink-300">
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-white select-none px-4 py-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded border border-pink-500 ${
                            currentPage === page ? "bg-pink-600 font-bold" : "hover:bg-pink-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (
                      (page === currentPage - 3 && page > 1) ||
                      (page === currentPage + 3 && page < totalPages)
                    ) {
                      return (
                        <span key={page} className="px-2 py-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {hasMore && (
              <div className="text-center text-xs text-zinc-400 mt-8 animate-pulse">
                Loading more models in the background...
              </div>
            )}
          </>
        )}
      </main>
      <footer
        className="text-center p-5 text-xs text-zinc-500"
        style={{ minHeight: "40px" }}
      >
        &copy; 2025 TSLive. All rights reserved.{" "}
        <Link href="/partners" className="text-pink-400 hover:underline ml-4">
          Our Partners
        </Link>
      </footer>
    </div>
  );
}