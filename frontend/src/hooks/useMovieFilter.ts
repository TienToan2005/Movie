import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';
import api from '@/services/api';

export const useMovieFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy các giá trị ban đầu từ URL
  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    country: searchParams.get('country') || '',
    page: parseInt(searchParams.get('page') || '0'),
  });

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Hàm đẩy các filter lên URL để đồng bộ
  const updateUrl = (newFilters: any) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params.set(key, newFilters[key].toString());
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Hàm gọi API (dùng useCallback để tránh render thừa)
  const fetchMovies = useCallback(async (currentFilters: any) => {
    setLoading(true);
    try {
      const res = await api.get('/movies/filter', { params: currentFilters });
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi lọc phim:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce riêng cho ô nhập Title (đợi 500ms sau khi ngừng gõ)
  const debouncedFetch = useCallback(
    debounce((f) => fetchMovies(f), 500),
    []
  );

  // Theo dõi sự thay đổi của filters
  useEffect(() => {
    updateUrl(filters);
    if (filters.title) {
        debouncedFetch(filters);
    } else {
        fetchMovies(filters);
    }
  }, [filters, fetchMovies]);

  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 0 })); // Đổi filter thì reset về trang 0
  };

  return { filters, data, loading, updateFilter, setFilters };
};