'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  type?: string;
  currentEpisode?: string;
  quality?: string;    
  subType?: string;     
}

function MovieList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [sliderMovies, setSliderMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState<string | null>(null);

  const titleQuery = searchParams.get('title') || '';
  const typeQuery = searchParams.get('type') || '';
  const genreId = searchParams.get('genreId') || '';
  const yearQuery = searchParams.get('year') || '';
  const countryQuery = searchParams.get('country') || '';

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setPage(0); 
  }, [titleQuery, typeQuery, genreId, yearQuery, countryQuery]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const isDiscoveryMode = !titleQuery && !typeQuery && !genreId && !yearQuery && !countryQuery;
      
      if (isDiscoveryMode && page === 0) {
        const sliderRes = await api.get('/movies/latest-slider');
        setSliderMovies(sliderRes.data.data || []);
      }

      const res = await api.get('/movies', {
        params: {
          title: titleQuery,
          type: typeQuery,
          categoryId: genreId,
          year: yearQuery,
          country: countryQuery,
          page: page,
          size: 20
        }
      });

      const rawData = res.data?.data;
      setMovies(rawData?.items || rawData?.content || []);
      setTotalPages(rawData?.totalPages || 0);

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      console.error("Lỗi fetch:", err);
      toast.error("Không thể tải danh sách phim!");
    } finally {
      setLoading(false);
    }
  }, [titleQuery, typeQuery, genreId, yearQuery, countryQuery, page]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.set('page', '0');
    router.push(`?${params.toString()}`);
  };

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  const getPageTitle = () => {
    if (titleQuery) return `KẾT QUẢ: "${titleQuery}"`;
    if (genreId) return '📂 THEO THỂ LOẠI';
    if (typeQuery === 'MOVIE') return '🎬 PHIM LẺ MỚI';
    if (typeQuery === 'SERIES') return '📺 PHIM BỘ MỚI';
    return '🔥 PHIM HOT HÀNG ĐẦU';
  };

  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/movies/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Không lấy được danh sách thể loại", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-10">
      {/* PHẦN 1: SLIDER */}
      {!titleQuery && !typeQuery && !genreId && !yearQuery && sliderMovies.length > 0 && (
        <section className="animate-in fade-in duration-700">
          <MovieSlider movies={sliderMovies as any} title="🎬 PHIM MỚI NHẤT" />
        </section>
      )}

      {/* PHẦN 2: FILTER BAR */}
      <div className="grid grid-cols-2 md:flex flex-wrap gap-3 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
        <select 
          className="bg-black border border-zinc-700 text-[10px] font-bold p-2.5 rounded-xl outline-none focus:border-red-600 transition-all uppercase tracking-widest cursor-pointer"
          value={genreId}
          onChange={(e) => handleFilterChange('genreId', e.target.value)}
        >
          <option value="">TẤT CẢ THỂ LOẠI</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
          ))}
        </select>

        <select 
          className="bg-black border border-zinc-700 text-[10px] font-bold p-2.5 rounded-xl outline-none focus:border-red-600 transition-all uppercase tracking-widest cursor-pointer"
          value={yearQuery}
          onChange={(e) => handleFilterChange('year', e.target.value)}
        >
          <option value="">TẤT CẢ NĂM</option>
          {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {(titleQuery || genreId || yearQuery) && (
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] font-black text-red-500 hover:text-white px-4 uppercase tracking-tighter transition-colors"
          >
            XÓA LỌC ✕
          </button>
        )}
      </div>

      {/* PHẦN 3: GRID PHIM */}
      <div className="flex justify-between items-center border-l-4 pl-4" style={{ borderColor: settings.primaryColor }}>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter" style={{ color: settings.primaryColor }}>
          {getPageTitle()}
        </h2>
        {isAdmin && (
          <Link href="/admin/dashboard" className="text-[10px] bg-yellow-500 text-black px-4 py-2 rounded-full font-black hover:scale-105 transition-all shadow-lg">
            ⚙️ QUẢN TRỊ
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
          {movies.length > 0 ? movies.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id} className="group relative">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-zinc-500 transition-all relative shadow-2xl bg-zinc-900">
                <img 
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <span className="bg-black/80 backdrop-blur-md text-[9px] px-2 py-0.5 rounded text-orange-400 font-bold border border-orange-400/20 shadow-lg">
                    {movie.currentEpisode || 'Full'}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                
                <div className="absolute bottom-0 p-4 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-sm truncate uppercase tracking-tighter mb-1 group-hover:text-red-500 transition-colors">{movie.title}</h3>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-yellow-500">⭐ {movie.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-zinc-400">{movie.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-20 text-zinc-500 font-bold italic border border-dashed border-zinc-800 rounded-3xl">
              KHÔNG TÌM THẤY BỘ PHIM NÀO PHÙ HỢP...
            </div>
          )}
        </div>
      )}

      {/* PHẦN 4: PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-10 border-t border-zinc-900">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="p-3 px-8 bg-zinc-900 border border-zinc-800 rounded-xl disabled:opacity-20 hover:bg-red-600 hover:border-red-600 transition-all font-black text-[10px] tracking-widest"
          >
            TRƯỚC
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-zinc-500 uppercase">Trang</span>
            <span className="text-lg font-black text-white">{page + 1} / {totalPages}</span>
          </div>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="p-3 px-8 bg-zinc-900 border border-zinc-800 rounded-xl disabled:opacity-20 hover:bg-red-600 hover:border-red-600 transition-all font-black text-[10px] tracking-widest"
          >
            SAU
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 max-w-7xl mx-auto overflow-hidden">
      <Suspense fallback={<div className="text-center py-20 font-black italic animate-pulse text-zinc-700 uppercase tracking-widest">Hệ thống đang khởi tạo...</div>}>
        <MovieList />
      </Suspense>
    </main>
  );
}