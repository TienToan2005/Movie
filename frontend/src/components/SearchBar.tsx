'use client';

import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import api from '@/services/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (q.trim().length < 1) {
          setResults([]);
          setIsOpen(false);
          return;
        }

        try {
          console.log("📡 Đang gửi request lên server với từ khóa:", q);
          const res = await api.get(`/movies/suggest?query=${encodeURIComponent(q)}`);
          console.log("✅ Dữ liệu trả về:", res.data.data);
          
          setResults(res.data.data || []);
          setIsOpen(true);
        } catch (err) {
          console.error("❌ Lỗi gọi API suggest:", err);
        }
      }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedFetch(val);
  };

  return (
    <div className="relative w-full max-w-md">
      <input 
        value={query}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full bg-zinc-800 border-2 border-transparent focus:border-red-600 p-2 px-5 rounded-full outline-none text-sm"
        placeholder="Tìm phim ngay..."
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-zinc-900 mt-2 rounded-xl shadow-2xl border border-zinc-800 z-[999] overflow-hidden">
          {results.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/movies/${movie.id}`} 
              className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-all border-b border-zinc-800/50 last:border-0"
            >
              <img src={movie.posterUrl} className="w-10 h-14 object-cover rounded" alt="" />
              <div>
                <h4 className="text-sm font-bold truncate w-40">{movie.title}</h4>
                <p className="text-[10px] text-zinc-500">{movie.year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}