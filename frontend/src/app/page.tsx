'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  averageRating: number;
  year: number;
  status: string;
  tmdbId?: number;
  type?: string;
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const titleQuery = searchParams.get('title');
  const type = searchParams.get('type');

  // Kiểm tra quyền Admin từ localStorage
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    setPage(0);
  }, [type, titleQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get('/movies', {
          params: {
            type: type || '',
            title: titleQuery || '',
            page: page,
            size: 20
          }
        });

        const responseData = res.data?.data || res.data;
        const allMovies: any[] = responseData.content || responseData.items || [];
        
        // Lọc phim có trạng thái AVAILABLE
        const availableMovies = allMovies.filter((movie: any) => movie.status === 'AVAILABLE');

        setMovies(availableMovies);
        setTotalPages(responseData.totalPages || 0);

      } catch (err: any) {
        console.error("Lỗi lấy phim:", err);
        toast.error("Không thể tải danh sách phim!");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type, titleQuery, page]);

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  const handleSyncMovie = async (e: React.MouseEvent, tmdbId: number, movieType: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const loadingToast = toast.loading("Đang đồng bộ dữ liệu...");
      await api.post(`/admin/dashboard/movies/sync/${movieType || 'movie'}/${tmdbId}`);
      toast.dismiss(loadingToast);
      toast.success("Đồng bộ TMDB thành công! 🔄");
    } catch (err) {
      toast.error("Lỗi đồng bộ dữ liệu!");
    }
  };

  const handleAddToWatchlist = async (e: React.MouseEvent, movieId: number) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || token === "undefined") {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    try {
      await api.post(`/users/watchlist/${movieId}`);
      toast.success("Đã thêm vào yêu thích! ❤️");
    } catch (err) {
      toast.error("Lỗi khi thêm vào danh sách!");
    }
  };

  const getPageTitle = () => {
    if (titleQuery) return `KẾT QUẢ: "${titleQuery}"`;
    if (type === 'MOVIE') return '🎬 DANH SÁCH PHIM LẺ';
    if (type === 'SERIES') return '📺 DANH SÁCH PHIM BỘ';
    return '🔥 PHIM MỚI NHẤT';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-pulse">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold text-red-600 tracking-wider border-l-4 border-red-600 pl-4 uppercase">
          {getPageTitle()}
        </h1>

        {/* NÚT DASHBOARD CHO ADMIN */}
        {isAdmin && (
          <Link 
            href="/admin/dashboard" 
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)]"
          >
            ⚙️ QUẢN TRỊ HỆ THỐNG
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {movies.length > 0 ? movies.map((movie) => (
          <div key={movie.id} className="relative group">
            {/* Nút yêu thích cho mọi User */}
            <button 
              onClick={(e) => handleAddToWatchlist(e, movie.id)}
              className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-red-600 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-xl"
            >
              ❤️
            </button>

            {/* Nút Sync nhanh chỉ dành cho ADMIN */}
            {isAdmin && movie.tmdbId && (
              <button 
                onClick={(e) => handleSyncMovie(e, movie.tmdbId!, movie.type || 'movie')}
                className="absolute top-3 left-3 z-20 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100 shadow-xl"
              >
                🔄 SYNC
              </button>
            )}

            <Link href={`/movies/${movie.id}`}>
              <div className="cursor-pointer bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition-all border border-zinc-800 hover:border-red-600 shadow-2xl">
                <div className="relative aspect-[2/3]">
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold">XEM NGAY</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate text-sm md:text-base">{movie.title}</h3>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <p className="text-yellow-400 font-bold">⭐ {movie.averageRating?.toFixed(1) || '0.0'}</p>
                    <span className="text-zinc-500">{movie.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
            <p className="text-zinc-400 text-xl mb-4">Không tìm thấy phim nào cả 😢</p>
            <Link href="/" className="text-red-600 underline">Quay lại xem tất cả phim</Link>
          </div>
        )}
      </div>

      {/* --- PHÂN TRANG --- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16 mb-10">
          <button
            disabled={page === 0}
            onClick={() => { setPage(p => p - 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-red-600 disabled:opacity-20 transition-all font-bold"
          >
            ← Trang trước
          </button>
          
          <span className="font-bold text-zinc-500">
            Trang <span className="text-white">{page + 1}</span> / {totalPages}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => { setPage(p => p + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-red-600 disabled:opacity-20 transition-all font-bold"
          >
            Trang sau →
          </button>
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Suspense fallback={<div className="text-white text-center py-20">Đang tải danh sách phim...</div>}>
        <MovieList />
      </Suspense>
    </main>
  );
}