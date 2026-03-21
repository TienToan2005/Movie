'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import MovieSlider from '@/components/MovieSlider';
import { useSettings } from '@/context/SettingsContext';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  averageRating: number;
  year: number;
  status: string;
  tmdbId?: number;
  type?: string;
  currentEpisode?: string;
  quality?: string;    
  subType?: string;     
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sliderMovies, setSliderMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const titleQuery = searchParams.get('title');
  const type = searchParams.get('type');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    setPage(0); 
  }, [type, titleQuery]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        if (!titleQuery && !type && page === 0) {
          const sliderRes = await api.get('/movies/latest-slider');
          setSliderMovies(sliderRes.data.data || []);
        }

        const res = await api.get('/movies', {
          params: {
            type: type || '',
            title: titleQuery || '',
            page: page,
            size: 20
          }
        });

        const rawData = res.data?.data;
        const allMovies = rawData?.items || rawData?.content || rawData?.data?.items || [];
        
        setMovies(allMovies);
        
        setTotalPages(rawData?.totalPages || rawData?.data?.totalPages || 0);

      } catch (err: any) {
        console.error("Lỗi hệ thống:", err);
        toast.error("Không thể tải danh sách phim!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [type, titleQuery, page]);

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  const handleAddToWatchlist = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    try {
      await api.post(`/users/watchlist/${movieId}`);
      toast.success("Đã thêm vào yêu thích! ❤️");
    } catch (err) {
      toast.error("Lỗi khi thêm phim!");
    }
  };

  const getPageTitle = () => {
    if (titleQuery) return `KẾT QUẢ: "${titleQuery}"`;
    if (type === 'MOVIE') return '🎬 PHIM LẺ MỚI';
    if (type === 'SERIES') return '📺 PHIM BỘ MỚI';
    return '🔥 PHIM HOT';
  };

  if (loading && page === 0) {
    return (
      <div className="space-y-12">
        {!titleQuery && !type && (
          <div className="h-64 md:h-80 bg-zinc-900 animate-pulse rounded-3xl w-full"></div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* PHẦN 1: SLIDER TRÊN CÙNG */}
      {!titleQuery && !type && sliderMovies.length > 0 && (
        <section className="mb-16">
          <MovieSlider movies={sliderMovies as any} title="🔥 PHIM MỚI CẬP NHẬT" />
        </section>
      )}

      {/* PHẦN 2: TIÊU ĐỀ DANH SÁCH & NÚT QUẢN TRỊ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold tracking-wider border-l-4 pl-4 uppercase"
            style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}>
          {getPageTitle()}
        </h1>

        {isAdmin && (
          <Link 
            href="/admin/dashboard" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          >
            ⚙️ QUẢN TRỊ
          </Link>
        )}
      </div>
      
      {/* PHẦN 3: GRID PHIM DƯỚI SLIDER */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {movies.length > 0 ? movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <button 
              onClick={(e) => handleAddToWatchlist(e, movie.id)}
              className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-red-600 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-xl"
            >
              ❤️
            </button>

            <Link href={`/movies/${movie.id}`}>
              <div className="cursor-pointer bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition-all border border-zinc-800 hover:border-zinc-500 shadow-2xl relative">
                <div className="relative aspect-[2/3]">
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* --- BADGE THÔNG TIN ĐÈ LÊN POSTER --- */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-[10px] px-2 py-1 rounded font-bold text-orange-400 border border-orange-400/30 flex gap-1 z-10 shadow-lg">
                    <span>{movie.currentEpisode || 'Full'}</span>
                    <span className="border-l border-orange-400/30 pl-1">{movie.quality || 'HD'}</span>
                    <span className="border-l border-orange-400/30 pl-1">{movie.subType || 'Vietsub'}</span>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">XEM NGAY</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold truncate text-sm md:text-base group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <p className="text-yellow-400 font-bold flex items-center gap-1">
                      ⭐ {movie.averageRating?.toFixed(1) || '0.0'}
                    </p>
                    <span className="text-zinc-500">{movie.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
            <p className="text-zinc-400 text-xl mb-4">Không tìm thấy phim nào cả 😢</p>
            <Link href="/" className="text-red-600 underline font-bold">Quay lại trang chủ</Link>
          </div>
        )}
      </div>

      {/* PHẦN 4: PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16 mb-10">
          <button
            disabled={page === 0}
            onClick={() => { setPage(p => p - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-red-600 disabled:opacity-20 transition-all font-bold"
          >
            ← Trước
          </button>
          
          <span className="font-bold text-zinc-500">
            Trang <span className="text-white">{page + 1}</span> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-red-600 disabled:opacity-20 transition-all font-bold"
          >
            Sau →
          </button>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 max-w-7xl mx-auto">
      <Suspense fallback={<div className="text-center py-20">Đang khởi tạo ứng dụng...</div>}>
        <MovieList />
      </Suspense>
    </main>
  );
}