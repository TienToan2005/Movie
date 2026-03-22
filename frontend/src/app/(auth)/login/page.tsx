'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      const loginData = res.data?.data;
      const token = res.data?.data?.accessToken; 

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', loginData.username);
        localStorage.setItem('userEmail', loginData.email);
        localStorage.setItem('role', loginData.role); // Lưu thêm role nếu cần
        toast.success("Đăng nhập thành công! 🎬");
        
        // Chuyển hướng về trang chủ và load lại để nhận state mới
        window.location.href = '/'; 
      } else {
        toast.error("Đăng nhập lỗi: Không nhận được token!");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Sai username hoặc mật khẩu!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
      <h2 
        style={{ color: settings.primaryColor }} 
        className="text-4xl font-black mb-8 text-center tracking-tighter uppercase italic"
      >
        ĐĂNG NHẬP
      </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tên đăng nhập</label>
            <input 
              required
              type="text" 
              placeholder="Username" 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none transition-all focus:border-zinc-600"
              style={{ caretColor: settings.primaryColor }}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Mật khẩu</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none transition-all focus:border-zinc-600"
              style={{ caretColor: settings.primaryColor }}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
            <div className="flex justify-end mt-1">
              <Link 
                href="/forgot-password" 
                className="text-zinc-500 text-[11px] font-bold uppercase hover:text-red-600 transition-colors tracking-tighter"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: settings.primaryColor }}
            className={`w-full py-4 rounded-xl font-black text-black transition-all mt-4 hover:opacity-90 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP NGAY'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            Chưa có nick? 
            <Link href="/register" style={{ color: settings.primaryColor }} className="ml-2 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <Link href="/" className="inline-block mt-6 text-xs text-zinc-600 hover:text-white transition-colors">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}