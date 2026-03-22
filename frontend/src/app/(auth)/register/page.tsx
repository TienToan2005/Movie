'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success("Đăng ký thành công! Hãy kiểm tra email để lấy mã xác thực.");
      router.push(`/verify-account?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('Email hoặc tên đăng nhập đã tồn tại!');
      } else {
        toast.error('Lỗi gì đó rồi, check lại nhé!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        
        <h2 
          style={{ color: settings.primaryColor }} 
          className="text-3xl font-black mb-2 text-center tracking-tighter uppercase italic"
        >
          ĐĂNG KÝ
        </h2>
        <p className="text-zinc-500 text-center text-xs font-bold mb-8 uppercase tracking-widest">Tạo tài khoản mới</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            required
            type="text" 
            placeholder="Tên đăng nhập" 
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none transition-all focus:border-zinc-600"
            style={{ caretColor: settings.primaryColor }}
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            required
            type="email" 
            placeholder="Email" 
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none transition-all focus:border-zinc-600"
            style={{ caretColor: settings.primaryColor }}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            required
            type="password" 
            placeholder="Mật khẩu" 
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none transition-all focus:border-zinc-600"
            style={{ caretColor: settings.primaryColor }}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: settings.primaryColor }}
            className={`w-full py-4 rounded-xl font-black text-black transition-all mt-4 hover:opacity-90 active:scale-95 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐĂNG KÝ'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            Đã có nick? 
            <Link href="/login" style={{ color: settings.primaryColor }} className="ml-2 font-bold hover:underline">
               Đăng nhập ngay
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