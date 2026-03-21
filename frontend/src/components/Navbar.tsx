'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  
  const { settings } = useSettings();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?title=${encodeURIComponent(searchTerm)}`);
    } else {
      router.push('/');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-black/95 sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <Link href="/" 
                  style={{ color: settings.primaryColor }}
                  className="text-2xl font-extrabold tracking-tighter hover:scale-105 transition-all">
              {settings.siteName}
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Trang chủ</Link>
              <Link href="/?type=MOVIE" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Phim lẻ</Link>
              <Link href="/?type=SERIES" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Phim bộ</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Tìm phim..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ '--tw-ring-color': settings.primaryColor } as any}
                className="bg-gray-900 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 w-48 lg:w-64 transition-all border border-gray-700"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-white">
                🔍
              </button>
            </form>

            {username ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 group cursor-pointer border-r border-gray-800 pr-4"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest group-hover:opacity-80 transition-colors">Tài khoản</span>
                    <span className="text-white text-sm font-bold">
                      {username}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                       style={{ backgroundColor: settings.primaryColor }}>
                    {username[0].toUpperCase()}
                  </div>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-[11px] font-bold uppercase transition-all"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                style={{ backgroundColor: settings.primaryColor }}
                className="text-white px-5 py-2 rounded-md text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-red-900/20"
              >
                ĐĂNG NHẬP
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}