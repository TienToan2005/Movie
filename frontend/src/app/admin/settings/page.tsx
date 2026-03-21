'use client';
import { useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [config, setConfig] = useState({
    site_name: 'TOANMOVIE',
    primary_color: '#ef4444',
    site_logo: ''
  });

  const handleSave = async () => {
    try {
      await api.post('/admin/dashboard/settings', config);
      toast.success("Hệ thống đã cập nhật diện mạo mới! ✨");
      window.location.reload();
    } catch (err) {
      toast.error("Lỗi lưu cài đặt!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-black mb-10 uppercase italic">⚙️ Cấu hình <span className="text-yellow-500">GIAO DIỆN</span></h1>

      <div className="max-w-2xl bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-6">
        {/* Đổi Tên */}
        <div>
          <label className="block text-xs text-zinc-500 mb-2 uppercase font-bold">Tên Website</label>
          <input type="text" value={config.site_name} 
            onChange={e => setConfig({...config, site_name: e.target.value})}
            className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none focus:border-yellow-500" />
        </div>

        {/* Đổi Màu sắc */}
        <div>
          <label className="block text-xs text-zinc-500 mb-2 uppercase font-bold">Màu chủ đạo (Hex)</label>
          <div className="flex gap-4">
            <input type="color" value={config.primary_color} 
              onChange={e => setConfig({...config, primary_color: e.target.value})}
              className="w-16 h-14 bg-black border border-zinc-700 rounded-xl p-1 cursor-pointer" />
            <input type="text" value={config.primary_color} 
              onChange={e => setConfig({...config, primary_color: e.target.value})}
              className="flex-1 bg-black border border-zinc-700 rounded-xl p-4 outline-none font-mono" />
          </div>
        </div>

        {/* Đổi Logo */}
        <div>
          <label className="block text-xs text-zinc-500 mb-2 uppercase font-bold">Link URL Logo</label>
          <input type="text" value={config.site_logo} 
            placeholder="https://..."
            onChange={e => setConfig({...config, site_logo: e.target.value})}
            className="w-full bg-black border border-zinc-700 rounded-xl p-4 outline-none" />
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl hover:bg-yellow-400 transition-all">
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
}