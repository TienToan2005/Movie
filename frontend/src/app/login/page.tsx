'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        toast.success("Đăng nhập thành công! 🎬");
        
        window.location.href = '/'; 
      } else {
        toast.error("Đăng nhập lỗi: Không nhận được token!");
        console.error("Cấu trúc trả về không đúng:", res.data);
      }

    } catch (err: any) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || "Sai username hoặc mật khẩu!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center tracking-tighter">
          TOAN MOVIE LOGIN
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tên đăng nhập</label>
            <input 
              required
              type="text" 
              placeholder="Tên đăng nhập" 
              className="w-full bg-black border border-gray-700 rounded p-3 outline-none focus:border-red-600 transition-all"
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Mật khẩu</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-black border border-gray-700 rounded p-3 outline-none focus:border-red-600 transition-all"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold transition-all mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'ĐANG XỬ LÝ...' : 'ĐANG NHẬP NGAY'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            Chưa có nick? <Link href="/register" className="text-red-500 hover:text-red-400 underline decoration-2">Đăng ký tài khoản</Link>
          </p>
          <Link href="/" className="inline-block mt-4 text-sm text-gray-500 hover:text-white">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}