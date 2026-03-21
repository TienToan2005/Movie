'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import MovieSlider from '@/components/MovieSlider';
import { useSettings } from '@/context/SettingsContext';

interface Episode {
  id: number;
  episodeNumber: number;
  title?: string;
  videoUrl: string;
}

interface MovieWatchDetail {
  id: number;
  title: string;
  type: string;
  episodes: Episode[];
  categories: { id: number; name: string }[];
}

function WatchContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const episodeId = searchParams.get('episodeId');
  const { settings } = useSettings();

  const [movie, setMovie] = useState<MovieWatchDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [relatedMovies, setRelatedMovies] = useState([]); // State cho phim liên quan
  const [loading, setLoading] = useState(true);
  
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // --- LOGIC: LƯU TIẾN ĐỘ VÀO LOCALSTORAGE ---
  const saveProgress = useCallback((movieId: number, epId: number, epNum: number) => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('movie_progress') || '{}');
      progress[movieId] = {
        episodeId: epId,
        episodeNumber: epNum,
        updatedAt: new Date().getTime()
      };
      localStorage.setItem('movie_progress', JSON.stringify(progress));
    }
  }, []);

  // Fetch dữ liệu phim chính
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies/${id}`);
        const data = res.data?.data || res.data;
        if (data) {
          setMovie(data);
          const episodes = (data.episodes as Episode[]) || [];
          if (episodes.length > 0) {
            const found = episodeId 
              ? episodes.find(e => e.id === Number(episodeId)) 
              : episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)[0];
            
            const selectedEp = found || episodes[0];
            setCurrentEpisode(selectedEp);
            saveProgress(Number(id), selectedEp.id, selectedEp.episodeNumber);
          }

          // --- FETCH PHIM LIÊN QUAN ---
          if (data.categories && data.categories.length > 0) {
            const catName = data.categories[0].name;
            const relatedRes = await api.get(`/movies/${id}/related`, {
              params: { category: catName }
            });
            setRelatedMovies(relatedRes.data?.data || []);
          }
        }
      } catch (err) {
        toast.error("Không thể tải dữ liệu phim!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieData();
    
    setShowAutoNext(false);
    setCountdown(10);
  }, [id, episodeId, saveProgress]);

  // Logic tìm tập tiếp theo
  const nextEpisode = movie?.episodes?.find(
    (ep) => ep.episodeNumber === (currentEpisode?.episodeNumber || 0) + 1
  );

  const handleNext = useCallback(() => {
    if (nextEpisode) {
      setShowAutoNext(false);
      router.push(`/watch/${id}?episodeId=${nextEpisode.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu khi đổi tập
    }
  }, [id, nextEpisode, router]);

  // Đếm ngược tự động chuyển tập
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAutoNext && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0 && showAutoNext) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [showAutoNext, countdown, handleNext]);

  const handlePrev = () => {
    const prev = movie?.episodes?.find(e => e.episodeNumber === (currentEpisode?.episodeNumber || 0) - 1);
    if (prev) {
        router.push(`/watch/${id}?episodeId=${prev.id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600">
      
      {/* Navigation */}
      <nav className="p-4 flex items-center gap-4 bg-gradient-to-b from-black/90 to-transparent fixed top-0 w-full z-[100]">
        <Link href={`/movies/${id}`} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>
        <div className="flex flex-col">
           <h1 className="text-sm md:text-xl font-black uppercase tracking-tighter italic leading-none">
             {movie?.title}
           </h1>
           <span className="text-red-600 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
             Đang xem: Tập {currentEpisode?.episodeNumber}
           </span>
        </div>
      </nav>

      <div className="pt-24 px-4 md:px-10 max-w-7xl mx-auto">
        
        {/* PLAYER AREA */}
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <iframe
            src={currentEpisode?.videoUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            frameBorder="0"
            title="Movie Player"
          />

          {showAutoNext && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fadeIn">
              <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs mb-3 font-bold">Tập tiếp theo sẽ phát sau</p>
              <h2 className="text-4xl md:text-6xl font-black mb-10 italic uppercase tracking-tighter">
                Tập {nextEpisode?.episodeNumber}
              </h2>
              <div className="relative w-28 h-28 flex items-center justify-center mb-10">
                 <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
                    <circle cx="56" cy="56" r="52" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                    <circle 
                        cx="56" cy="56" r="52" stroke="currentColor" strokeWidth="5" fill="transparent" 
                        strokeDasharray={326} 
                        strokeDashoffset={326 - (326 * countdown) / 10}
                        className="text-red-600 transition-all duration-1000 ease-linear" 
                    />
                 </svg>
                 <span className="text-4xl font-black tabular-nums">{countdown}</span>
              </div>
              <div className="flex gap-5">
                <button onClick={handleNext} className="bg-red-600 text-white px-10 py-4 rounded-md font-black hover:bg-red-700 transition-all">
                  PHÁT NGAY
                </button>
                <button onClick={() => setShowAutoNext(false)} className="bg-white/10 text-white px-10 py-4 rounded-md font-black hover:bg-white/20 transition-all">
                  HỦY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Hệ thống phát phim ổn định</span>
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
                Tập {currentEpisode?.episodeNumber}: {currentEpisode?.title || `Bản Full`}
            </h3>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={handlePrev} disabled={currentEpisode?.episodeNumber === 1} className="flex-1 md:flex-none px-5 py-3 bg-zinc-800/80 rounded-xl hover:bg-zinc-700 disabled:opacity-20 font-bold">Tập trước</button>
            <button onClick={handleNext} disabled={!nextEpisode} className="flex-1 md:flex-none px-8 py-3 bg-red-600 rounded-xl font-black hover:bg-red-700 disabled:opacity-20 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
               TẬP TIẾP <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* EPISODE LIST */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Danh sách <span className="text-red-600">tập phim</span></h2>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
            {movie?.episodes?.sort((a,b) => a.episodeNumber - b.episodeNumber).map((ep) => (
              <button
                key={ep.id}
                onClick={() => {
                    router.push(`/watch/${id}?episodeId=${ep.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`py-4 rounded-xl font-black transition-all border ${
                  currentEpisode?.id === ep.id 
                  ? 'bg-red-600 border-red-500 shadow-lg shadow-red-600/20 scale-105' 
                  : 'bg-zinc-900/60 border-white/5 hover:border-red-600/50'
                }`}
              >
                {ep.episodeNumber}
              </button>
            ))}
          </div>
        </div>

        {/* --- PHẦN PHIM LIÊN QUAN --- */}
        {relatedMovies.length > 0 && (
          <div className="mt-24 pb-20 border-t border-white/5 pt-10">
            <MovieSlider movies={relatedMovies} title="🎬 Có thể bạn cũng thích" />
          </div>
        )}

      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#141414] flex items-center justify-center"><div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <WatchContent />
    </Suspense>
  );
}