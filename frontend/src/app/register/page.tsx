'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success("Đăng ký thành công! Đăng nhập thôi.!");
      router.push('/login');
    } catch (err: any) {
        if (err.response?.status === 409) {
        toast.error('Email này có người dùng rồi, hãy thử cái khác!');
        } else {
        toast.error('Lỗi gì đó rồi, check lại nhé!');
        }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">ĐĂNG KÝ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Tên đăng nhập" 
            className="w-full bg-black border border-gray-700 rounded p-3 outline-none focus:border-red-600"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-black border border-gray-700 rounded p-3 outline-none focus:border-red-600"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Mật khẩu" 
            className="w-full bg-black border border-gray-700 rounded p-3 outline-none focus:border-red-600"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold transition-all">
            TẠO TÀI KHOẢN
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">Đã có nick? <Link href="/login" className="text-red-500 underline">Đăng nhập ngay</Link></p>
      </div>
    </div>
  );
}