'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import SearchBar from '@/components/SearchBar'; // Import component xịn đã sửa

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const { settings } = useSettings();
  const router = useRouter();

  useEffect(() => {
    // Lấy thông tin từ localStorage khi trang load
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setRole(null);
    // Ép load lại trang chủ để xóa sạch state cũ
    window.location.href = '/';
  };

  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  return (
    <nav className="bg-black/95 sticky top-0 z-[100] border-b border-zinc-800 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* CỘT TRÁI: LOGO & MENU CHÍNH */}
          <div className="flex items-center gap-10">
            <Link href="/" 
                  style={{ color: settings.primaryColor }}
                  className="text-3xl font-[1000] tracking-tighter hover:scale-105 transition-all italic uppercase"
            >
              {settings.siteName || 'TOANMOVIE'}
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-zinc-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Trang chủ</Link>
              <Link href="/?type=MOVIE" className="text-zinc-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Phim lẻ</Link>
              <Link href="/?type=SERIES" className="text-zinc-400 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Phim bộ</Link>
              
              {/* Nút Admin ẩn hiện theo Role */}
              {isAdmin && (
                <Link href="/admin/dashboard" className="text-yellow-500 hover:text-yellow-400 text-[11px] font-black uppercase tracking-widest transition-colors border border-yellow-500/30 px-3 py-1 rounded-md">
                  Quản trị
                </Link>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: SEARCH BAR & USER ACTION */}
          <div className="flex items-center gap-6">
            
            {/* ĐÂY CHÍNH LÀ CHỖ THAY THẾ Ô INPUT CŨ */}
            <div className="hidden md:block w-72 lg:w-96">
               <SearchBar />
            </div>

            {username ? (
              <div className="flex items-center gap-6 border-l border-zinc-800 pl-6">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/profile')}>
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-zinc-500 text-[9px] uppercase font-black tracking-tighter mb-1">Thành viên</span>
                    <span className="text-white text-sm font-black truncate max-w-[100px]">
                      {username}
                    </span>
                  </div>
                  
                  {/* Avatar vuông bo góc hiện đại */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform"
                       style={{ backgroundColor: settings.primaryColor, color: '#000' }}>
                    {username[0].toUpperCase()}
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                style={{ backgroundColor: settings.primaryColor }}
                className="text-black px-6 py-2.5 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-600/20 uppercase italic"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}