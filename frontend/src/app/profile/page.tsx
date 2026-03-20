'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

export default function ProfilePage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userEmail = localStorage.getItem('userEmail');
    setUsername(username || 'User');
    setUserEmail(userEmail || "")
const fetchWatchlist = async () => {
  try {
    const res = await api.get('/users/watchlist');
    // Vì Backend trả về Page Response, dữ liệu nằm trong res.data.data.content
    const movies = res.data?.data?.content || res.data?.data || [];
    setWatchlist(movies);
  } catch (err) {
    console.error("Lỗi lấy watchlist:", err);
    setWatchlist([]);
  } finally {
    setLoading(false);
  }
};

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId: number) => {
    try {
      await api.delete(`/users/watchlist/${movieId}`);
      setWatchlist(watchlist.filter(m => m.id !== movieId));
      toast.success("Đã xóa khỏi danh sách!");
    } catch (err) {
      toast.error("Không thể xóa phim!");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR: THÔNG TIN CÁ NHÂN */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 sticky top-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-red-600/20">
                {username[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{username}</h2>
                <p className="text-gray-500 text-sm">{userEmail}</p>
              </div>
              <div className="w-full pt-6 border-t border-gray-800 space-y-3">
                <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-all">Sửa Profile</button>
                <button 
                  onClick={() => { localStorage.clear(); window.location.href='/'; }}
                  className="w-full py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg text-sm transition-all font-bold"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT: DANH SÁCH YÊU THÍCH */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 italic">
            <span className="text-red-600">❤</span> DANH SÁCH YÊU THÍCH
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-900 rounded-2xl"></div>
              ))}
            </div>
          ) : watchlist.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((movie) => (
                <div key={movie.id} className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-600 transition-all shadow-xl">
                  <Link href={`/movies/${movie.id}`}>
                    <img 
                      src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => handleRemove(movie.id)}
                      className="bg-black/60 hover:bg-red-600 p-2 rounded-full backdrop-blur-md transition-colors"
                      title="Xóa khỏi danh sách"
                    >
                      🗑
                    </button>
                  </div>
                  <div className="p-3 bg-gray-900/90 absolute bottom-0 w-full backdrop-blur-sm">
                    <h3 className="font-bold text-sm truncate">{movie.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-dashed border-gray-800">
              <p className="text-gray-500 mb-4">Danh sách trống ...</p>
              <Link href="/" className="bg-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-700">Đi xem phim ngay</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}