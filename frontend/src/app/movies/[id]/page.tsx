'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Actor {
  name: string;
  profileUrl: string | null;
}

interface Episode {
  id: number;
  episodeNumber: number;
  title?: string;
  videoUrl: string;
}

interface MovieDetail {
  id: number;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl: string | null;
  description: string;
  averageRating: number;
  year?: number;
  durationMinutes?: number;
  actors: Actor[];
  episodes: Episode[];
  director?: string;
  country?: string;
  language?: string;
}

function MovieDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: LẤY LỊCH SỬ XEM TỪ LOCALSTORAGE ---
  const [lastWatched, setLastWatched] = useState<{ epId: number; epNum: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progressData = localStorage.getItem('movie_progress');
      if (progressData) {
        const progress = JSON.parse(progressData);
        // Nếu bộ phim này có trong lịch sử xem
        if (progress[id as string]) {
          setLastWatched({
            epId: progress[id as string].episodeId,
            epNum: progress[id as string].episodeNumber
          });
        }
      }
    }
  }, [id]);

  const handlePlayAction = () => {
    if (!movie?.episodes || movie.episodes.length === 0) {
      toast.error("Phim đang cập nhật tập mới, vui lòng quay lại sau!");
      return;
    }

    if (lastWatched) {
      // Nếu có lịch sử -> Xem tiếp tập đó
      router.push(`/watch/${movie.id}?episodeId=${lastWatched.epId}`);
    } else {
      // Nếu không -> Xem tập 1
      const sortedEpisodes = [...movie.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);
      const firstEpisode = sortedEpisodes[0];
      router.push(`/watch/${movie.id}?episodeId=${firstEpisode.id}`);
    }
  };

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies/${id}`);
        const finalData = res.data?.data || res.data?.result || res.data;
        
        if (finalData && finalData.id) {
          setMovie(finalData);
        } else {
          throw new Error("Dữ liệu không đúng định dạng");
        }
      } catch (err: any) {
        console.error("Lỗi fetch:", err);
        toast.error("Không thể tải thông tin phim!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovieDetail();
  }, [id]);

  // Helpers
  const getFullImageUrl = (path: string | null) => {
    if (!path) return `https://ui-avatars.com/api/?background=333&color=fff&name=N/A`;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getEmbedTrailer = (url: string | null) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('embed/')) videoId = url.split('embed/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  if (loading) return (
    <div className="h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return (
    <div className="h-screen bg-[#141414] text-white flex items-center justify-center italic">
      Phim không tồn tại hoặc lỗi Server!
    </div>
  );

  return (
    <main className="min-h-screen bg-[#141414] text-white selection:bg-red-600 overflow-x-hidden font-sans">
      
      <div className="relative h-[75vh] md:h-[85vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={movie.backdropUrl || movie.posterUrl} 
            className="w-full h-full object-cover object-top"
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
        </div>

        <div className="absolute top-6 left-6 md:left-12 z-50">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-all group bg-black/20 p-2 rounded-lg backdrop-blur-sm">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Trang chủ</span>
          </Link>
        </div>

        <div className="absolute bottom-[10%] left-6 md:left-16 z-30 max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl italic">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-5 text-lg font-bold">
            <span className="text-green-400">⭐ {movie.averageRating?.toFixed(1)}</span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="border border-white/40 px-2 py-0.5 text-xs rounded-sm uppercase tracking-tighter text-white/60">HD</span>
            <span className="text-gray-300 uppercase">{movie.durationMinutes || '??'} PHÚT</span>
          </div>

          <p className="text-gray-200 text-lg md:text-xl leading-relaxed line-clamp-3 md:max-w-2xl drop-shadow-md">
            {movie.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* --- NÚT XEM NGAY / XEM TIẾP --- */}
            <button 
              onClick={handlePlayAction}
              className="flex items-center gap-3 bg-red-600 text-white px-10 py-3.5 rounded-md font-black text-xl hover:bg-red-700 transition shadow-lg active:scale-95 transform hover:scale-105"
            >
              <span>▶</span> {lastWatched ? `XEM TIẾP TẬP ${lastWatched.epNum}` : "XEM NGAY"}
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              className="flex items-center gap-3 bg-zinc-500/40 text-white px-10 py-3.5 rounded-md font-black text-xl hover:bg-zinc-500/60 transition backdrop-blur-md"
            >
              <span>ⓘ</span> CHI TIẾT
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-40 px-6 md:px-16 pb-20 -mt-10">
        {/* Phần danh sách tập phim, dàn diễn viên... giữ nguyên như cũ */}
        {movie.episodes && movie.episodes.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-white italic">
                Danh sách <span className="text-red-600">tập phim</span>
              </h3>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {[...movie.episodes]
                .sort((a, b) => a.episodeNumber - b.episodeNumber)
                .map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => router.push(`/watch/${movie.id}?episodeId=${ep.id}`)}
                  className={`px-8 py-4 border border-white/5 rounded-lg transition-all font-black text-lg group min-w-[120px] ${
                    lastWatched?.epId === ep.id 
                    ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105' 
                    : 'bg-zinc-800/50 hover:bg-red-600'
                  }`}
                >
                  TẬP {ep.episodeNumber}
                  <span className="block text-[10px] text-gray-500 group-hover:text-white/80 font-bold uppercase mt-1">Server VIP</span>
                </button>
              ))}
            </div>
          </section>
        )}
        
        {/* ... (Các section khác: actors, trailer, footer) */}
        {movie.actors && movie.actors.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-2xl font-bold uppercase tracking-widest text-white italic">
                Dàn diễn viên <span className="text-red-600">chính</span>
              </h3>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth">
              {movie.actors.map((actor, index) => (
                <div key={index} className="flex-shrink-0 w-36 flex flex-col items-center group snap-start">
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-red-600 group-hover:scale-110 transition-all duration-500 z-10" />
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl bg-zinc-800 ring-4 ring-zinc-900">
                      <img 
                        src={getFullImageUrl(actor.profileUrl)} 
                        alt={actor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <p className="text-sm font-black text-gray-400 group-hover:text-white transition-colors text-center uppercase tracking-tighter">
                    {actor.name}
                  </p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase mt-1 text-center">Diễn viên</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {movie.trailerUrl && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-[1px] bg-white/10" />
              <h3 className="text-2xl font-bold uppercase tracking-widest text-white italic">
                Trailer <span className="text-red-600">Official</span>
              </h3>
            </div>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
              <iframe 
                src={getEmbedTrailer(movie.trailerUrl)} 
                allowFullScreen 
                className="absolute inset-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" 
                title="Movie Trailer"
              />
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-10 border-t border-white/5 text-sm text-gray-500 font-medium">
          <div>
            <p className="uppercase text-[10px] tracking-widest mb-2 font-black text-zinc-600">Đạo diễn</p>
            <p className="text-zinc-300 text-lg">{movie.director || "Đang cập nhật"}</p>
          </div>
          <div>
            <p className="uppercase text-[10px] tracking-widest mb-2 font-black text-zinc-600">Quốc gia</p>
            <p className="text-zinc-300 text-lg">{movie.country || "Đang cập nhật"}</p>
          </div>
          <div>
            <p className="uppercase text-[10px] tracking-widest mb-2 font-black text-zinc-600">Phát hành</p>
            <p className="text-zinc-300 text-lg">{movie.year}</p>
          </div>
          <div>
            <p className="uppercase text-[10px] tracking-widest mb-2 font-black text-zinc-600">Ngôn ngữ</p>
            <p className="text-zinc-300 text-lg uppercase">{movie.language || "Vietsub"}</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}

export default function MoviePage() {
  return (
    <Suspense fallback={<div className="bg-[#141414] min-h-screen flex items-center justify-center text-white">Đang tải...</div>}>
      <MovieDetailContent />
    </Suspense>
  );
}