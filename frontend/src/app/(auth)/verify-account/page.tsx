'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

export default function VerifyAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  
  const email = searchParams.get('email') || "";
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Tự động đếm ngược để gửi lại mã
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Xử lý khi nhập từng ô OTP
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Xử lý khi nhấn Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return toast.error("Vui lòng nhập đủ 6 số!");

    setLoading(true);
    try {
      await api.post('/auth/verify-account', { email, otp: otpString });
      toast.success("Kích hoạt tài khoản thành công! Đang chuyển hướng...");
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Mã OTP không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/auth/forgot-password', { email });
      setCountdown(60);
      toast.success("Đã gửi mã mới vào email của bạn!");
    } catch (err) {
      toast.error("Gửi lại mã thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl text-center">
        
        <div className="mb-6 inline-flex p-4 rounded-full bg-zinc-800/50">
           <span className="text-4xl">✉️</span>
        </div>

        <h2 style={{ color: settings.primaryColor }} className="text-3xl font-[900] mb-2 uppercase italic tracking-tighter">
            Xác thực tài khoản
        </h2>
        <p className="text-zinc-500 text-sm mb-8">
            Mã OTP gồm 6 chữ số đã được gửi đến: <br/>
            <span className="text-zinc-200 font-bold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => (inputs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-16 bg-black border border-zinc-800 rounded-xl text-center text-2xl font-black focus:border-red-600 outline-none transition-all"
                style={{ caretColor: settings.primaryColor }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: settings.primaryColor }}
            className={`w-full py-4 rounded-2xl font-black text-black uppercase tracking-tighter transition-all ${loading ? 'opacity-50' : 'hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-600/10'}`}
          >
            {loading ? 'Đang kiểm tra...' : 'Kích hoạt ngay'}
          </button>
        </form>

        <div className="mt-8">
            {countdown > 0 ? (
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    Gửi lại mã sau <span className="text-red-600">{countdown}s</span>
                </p>
            ) : (
                <button onClick={resendOtp} className="text-xs font-black uppercase tracking-widest hover:underline" style={{ color: settings.primaryColor }}>
                    Gửi lại mã xác nhận
                </button>
            )}
        </div>
      </div>
    </div>
  );
}