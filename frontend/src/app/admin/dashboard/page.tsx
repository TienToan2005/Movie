'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
// Nhớ npm install recharts trước nhé
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalMovies: number;
  totalUsers: number;
  totalReviews: number;
  totalViews: number;
  categoryStats: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mảng màu gradient cho biểu đồ tròn, tông màu Dark giống giao diện bạn
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        // Backend Toàn đã fix Interface Projection nên dữ liệu ở đây rất chuẩn
        setStats(res.data.data);
      } catch (err) {
        toast.error("Bạn không có quyền truy cập hoặc lỗi server!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-white text-center">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          Hệ thống <span className="text-red-600">THỐNG KÊ</span>
        </h1>
      </div>

      {/* Grid thống kê (Giữ lại giao diện đẹp của Toàn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Tổng số phim" value={stats?.totalMovies} unit="phim" icon="🎬" />
        <StatCard title="Người dùng" value={stats?.totalUsers} unit="nick" icon="👤" />
        <StatCard title="Lượt đánh giá" value={stats?.totalReviews} unit="review" icon="⭐" />
        <StatCard title="Tổng lượt xem" value={stats?.totalViews} unit="view" icon="🔥" />
      </div>

      {/* --- PHẦN BIỂU ĐỒ (CategoryStats) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 h-[450px]">
          <h3 className="text-xl font-bold mb-6 text-zinc-300">TỶ LỆ THỂ LOẠI PHIM</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.categoryStats}
                dataKey="count"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={130}
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats?.categoryStats.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' }} 
                itemStyle={{ color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bạn có thể thêm biểu đồ UserGrowth vào đây nếu thích */}
      </div>
    </div>
  );
}

// Component StatCard để reuse giao diện đẹp
function StatCard({ title, value, unit, icon }: { title: string, value?: number, unit: string, icon: string }) {
    return (
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-2xl transition-transform hover:scale-105 active:scale-95 group">
            <div className="flex justify-between items-center mb-4">
                <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest">{title}</p>
                <span className="text-2xl group-hover:scale-125 transition-transform">{icon}</span>
            </div>
            <h2 className="text-5xl font-black mt-2 text-white bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                {value || 0}
            </h2>
            <p className="text-zinc-600 text-sm mt-1">{unit}</p>
        </div>
    );
}