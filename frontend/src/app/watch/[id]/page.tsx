'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Episode {
  id: number;
  episodeNumber: number;
  title?: string;
  videoUrl: string;
}

interface MovieWatchDetail {
  id: number;
  title: string;
  episodes: Episode[];
}

function WatchContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const episodeId = searchParams.get('episodeId');

  const [movie, setMovie] = useState<MovieWatchDetail | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
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
            
            // Lưu tiến độ ngay khi load tập phim
            saveProgress(Number(id), selectedEp.id, selectedEp.episodeNumber);
          }
        }
      } catch (err) {
        toast.error("Không thể tải dữ liệu phim!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieData();
    
    // Reset auto-next khi đổi tập
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
    if (prev) router.push(`/watch/${id}?episodeId=${prev.id}`);
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600">
      
      {/* Navigation - Netflix Style */}
      <nav className="p-4 flex items-center gap-4 bg-gradient-to-b from-black/90 to-transparent fixed top-0 w-full z-[100] transition-all duration-300">
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

      <div className="pt-24 px-4 md:px-10 max-w-6xl mx-auto">
        
        {/* PLAYER AREA */}
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.7)] border border-white/5 group">
          <iframe
            src={currentEpisode?.videoUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            frameBorder="0"
            title="Movie Player"
          />

          {/* AUTO NEXT OVERLAY */}
          {showAutoNext && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-all duration-500 animate-fadeIn">
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
                <button onClick={handleNext} className="bg-red-600 text-white px-10 py-4 rounded-md font-black hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">
                  PHÁT NGAY
                </button>
                <button onClick={() => setShowAutoNext(false)} className="bg-white/10 text-white px-10 py-4 rounded-md font-black hover:bg-white/20 transition-all backdrop-blur-md">
                  HỦY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS & INFO */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Server VIP • 1080p</span>
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-tight">
                Tập {currentEpisode?.episodeNumber}: {currentEpisode?.title || `Bản Full`}
            </h3>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handlePrev} 
              disabled={currentEpisode?.episodeNumber === 1} 
              className="flex-1 md:flex-none px-5 py-3 bg-zinc-800/80 rounded-xl hover:bg-zinc-700 disabled:opacity-20 transition-all font-bold text-sm"
            >
               Tập trước
            </button>
            <button 
              onClick={handleNext} 
              disabled={!nextEpisode} 
              className="flex-1 md:flex-none px-8 py-3 bg-red-600 rounded-xl font-black hover:bg-red-700 disabled:opacity-20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
               TẬP TIẾP <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* EPISODE LIST */}
        <div className="mt-16 pb-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Danh sách <span className="text-red-600">tập phim</span></h2>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {movie?.episodes?.sort((a,b) => a.episodeNumber - b.episodeNumber).map((ep) => (
              <button
                key={ep.id}
                onClick={() => router.push(`/watch/${id}?episodeId=${ep.id}`)}
                className={`group relative py-5 rounded-2xl font-black transition-all duration-300 border overflow-hidden ${
                  currentEpisode?.id === ep.id 
                  ? 'bg-red-600 border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.3)] scale-105 z-10' 
                  : 'bg-zinc-900/60 border-white/5 hover:border-red-600/50 hover:bg-zinc-800'
                }`}
              >
                <span className={currentEpisode?.id === ep.id ? 'text-white' : 'text-zinc-500 group-hover:text-white'}>
                    {ep.episodeNumber}
                </span>
                {currentEpisode?.id === ep.id && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #141414; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #E50914; }
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