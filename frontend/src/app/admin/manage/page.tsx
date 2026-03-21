'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  type: string;
  year: number;
  status: string;
  posterUrl?: string;
}

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Sync và Modal
  const [syncType, setSyncType] = useState('movie');
  const [tmdbId, setTmdbId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies?size=100'); 
      const movieList = res.data?.data?.items || [];
      setMovies(movieList);
    } catch (err) {
      toast.error("Lỗi nạp danh sách phim!");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncMovie = async () => {
    if(!tmdbId) return toast.error("Vui lòng nhập ID!");
    setSyncing(true);
    try {
      const cleanId = tmdbId.includes('/') ? tmdbId.split('/').pop() : tmdbId;
      await api.post(`/admin/dashboard/movies/sync/${syncType}/${cleanId}`);
      toast.success("Đồng bộ thành công! 🚀");
      setTmdbId('');
      fetchMovies();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi đồng bộ!");
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdate = async (id: number, updatedData: any) => {
    try {
      const res = await api.put(`/admin/dashboard/${id}`, updatedData);
      if (res.data) {
        toast.success("Cập nhật thông tin phim thành công! ✨");
        setIsModalOpen(false); 
        fetchMovies(); 
      }
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phim này không?")) {
      try {
        await api.delete(`/admin/dashboard/${id}`);
        toast.success("Đã xóa phim!");
        fetchMovies();
      } catch (err) {
        toast.error("Lỗi khi xóa phim!");
      }
    }
  };

  if (loading) return <div className="p-10 text-white text-center font-bold">Đang tải trình quản lý...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          Quản lý <span className="text-yellow-500">DANH SÁCH PHIM</span>
        </h1>
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-all hover:translate-x-[-4px]">
          ← Về Thống kê
        </Link>
      </div>

      {/* --- PHẦN SYNC TMDB --- */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-10 shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-zinc-300">THÊM PHIM NHANH TỪ TMDB (ID)</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            value={syncType}
            onChange={(e) => setSyncType(e.target.value)}
            className="bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-500 text-white"
          >
            <option value="movie">🎬 PHIM LẺ</option>
            <option value="tv">📺 PHIM BỘ</option>
          </select>
          <input 
            type="text" 
            placeholder="Nhập TMDB ID (Ví dụ: 687163)" 
            value={tmdbId}
            onChange={(e) => setTmdbId(e.target.value)}
            className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-500 text-white"
          />
          <button 
            onClick={handleSyncMovie}
            disabled={syncing}
            className={`bg-yellow-500 text-black font-black px-8 py-3 rounded-lg hover:bg-yellow-400 transition-all ${syncing ? 'opacity-50' : 'active:scale-95'}`}
          >
            {syncing ? 'ĐANG SYNC...' : 'ĐỒNG BỘ NGAY'}
          </button>
        </div>
      </div>

      {/* --- BẢNG QUẢN LÝ --- */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold uppercase tracking-tight">TỔNG DANH SÁCH ({movies.length} phim)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-400 text-sm uppercase">
                <th className="p-4">ID</th>
                <th className="p-4">Tên phim</th>
                <th className="p-4">Loại</th>
                <th className="p-4">Năm</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-all group">
                  <td className="p-4 text-zinc-500 font-mono">#{movie.id}</td>
                  <td className="p-4 font-bold flex items-center gap-3">
                    {movie.posterUrl && <img src={movie.posterUrl} alt="" className="w-10 h-14 object-cover rounded shadow-lg" />}
                    {movie.title}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${movie.type === 'MOVIE' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {movie.type}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400">{movie.year}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button 
                      onClick={() => { setSelectedMovie(movie); setIsModalOpen(true); }}
                      className="bg-zinc-800 hover:bg-blue-600 p-2.5 rounded-full transition-all" 
                      title="Sửa"
                    >✏️</button>
                    <button 
                      onClick={() => handleDelete(movie.id)}
                      className="bg-zinc-800 hover:bg-red-600 p-2.5 rounded-full transition-all" 
                      title="Xóa"
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHỈNH SỬA PHIM --- */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-black mb-6 text-yellow-500 uppercase">Chỉnh sửa phim</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-zinc-500 mb-2 uppercase font-bold">Tên phim</label>
                <input 
                  type="text" 
                  defaultValue={selectedMovie.title}
                  id="edit-title"
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-yellow-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-2 uppercase font-bold">Năm phát hành</label>
                <input 
                  type="number" 
                  defaultValue={selectedMovie.year}
                  id="edit-year"
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-yellow-500 transition-all"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                >HỦY</button>
                <button 
                  onClick={() => {
                    const updated = {
                      ...selectedMovie,
                      title: (document.getElementById('edit-title') as HTMLInputElement).value,
                      year: parseInt((document.getElementById('edit-year') as HTMLInputElement).value)
                    };
                    handleUpdate(selectedMovie.id, updated);
                  }}
                  className="flex-1 px-6 py-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-all"
                >LƯU THAY ĐỔI</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}