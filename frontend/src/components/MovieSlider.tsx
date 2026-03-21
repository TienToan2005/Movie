'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

import 'swiper/css';
import 'swiper/css/navigation';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  currentEpisode?: string;
  subType?: string;
}

export default function MovieSlider({ movies, title }: { movies: Movie[], title: string }) {
  const { settings } = useSettings();

  return (
    <div className="relative py-8 group">
      <h2 className="text-2xl font-medium mb-6 border-l-4 pl-4 uppercase tracking-wider" 
          style={{ color: settings.primaryColor, borderColor: settings.primaryColor }}
        >
        {title}
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2} 
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 5000 }}
        className="movie-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/movies/${movie.id}`} className="block group/card">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 transition-all group-hover/card:border-zinc-500 shadow-lg">
                <img 
                  src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[10px] px-2 py-1 rounded font-bold text-orange-400 border border-orange-400/30 flex gap-1">
                   <span>{movie.currentEpisode || 'Full'}</span>
                   <span className="border-l border-orange-400/30 pl-1">{movie.subType || 'Vietsub'}</span>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white text-xl">▶</span>
                   </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold truncate group-hover/card:text-white transition-colors">
                {movie.title}
              </h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.6);
          width: 45px !important;
          height: 45px !important;
          border-radius: 10px;
          opacity: 0;
          transition: all 0.3s;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: ${settings.primaryColor};
        }
      `}</style>
    </div>
  );
}