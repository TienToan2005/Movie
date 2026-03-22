'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP, 3: Đổi Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  // --- LOGIC COUNTDOWN 60S ---
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Bước 1: Gửi mã OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success("Mã OTP đã được gửi về Email!");
      setStep(2);
      setCountdown(60); // Bắt đầu đếm ngược 60s
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Email không tồn tại!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      toast.success("Xác nhận thành công!");
      setStep(3);
    } catch (err: any) {
      toast.error("Mã OTP không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err: any) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        
        <h2 
          style={{ color: settings.primaryColor }} 
          className="text-4xl font-black mb-8 text-center tracking-tighter uppercase italic"
        >
            {step === 1 && "Quên mật khẩu"}
            {step === 2 && "Xác nhận mã"}
            {step === 3 && "Mật khẩu mới"}
        </h2>
        <p className="text-zinc-400 text-sm mb-8">
            {step === 1 && "Nhập email của bạn để nhận mã khôi phục."}
            {step === 2 && `Mã đã gửi đến: ${email}`}
            {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn."}
        </p>

        {/* FORM BƯỚC 1: NHẬP EMAIL */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input 
              type="email" required placeholder="Email của bạn"
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={loading} className="w-full bg-red-600 p-4 rounded-xl font-black hover:bg-red-700 transition-all disabled:opacity-50">
              {loading ? "ĐANG GỬI..." : "GỬI MÃ XÁC NHẬN"}
            </button>
          </form>
        )}

        {/* FORM BƯỚC 2: NHẬP OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input 
              type="text" required maxLength={6} placeholder="MÃ OTP"
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none text-center text-2xl tracking-[0.5em] font-bold"
              value={otp} onChange={(e) => setOtp(e.target.value)}
            />
            <button disabled={loading} className="w-full bg-red-600 p-4 rounded-xl font-black">
              TIẾP TỤC
            </button>
            
            {/* NÚT GỬI LẠI MÃ CÓ COUNTDOWN */}
            <div className="text-center mt-4">
                {countdown > 0 ? (
                    <p className="text-zinc-500 text-xs font-bold uppercase">
                        Gửi lại mã sau <span className="text-red-600">{countdown}s</span>
                    </p>
                ) : (
                    <button type="button" onClick={handleRequestOtp} className="text-red-600 text-xs font-black uppercase hover:underline">
                        GỬI LẠI MÃ NGAY
                    </button>
                )}
            </div>
          </form>
        )}

        {/* FORM BƯỚC 3: NHẬP PASS MỚI */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input 
              type="password" required placeholder="Mật khẩu mới"
              className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-red-600 outline-none"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            />
            <button disabled={loading} className="w-full bg-red-600 p-4 rounded-xl font-black">
              XÁC NHẬN ĐỔI MẬT KHẨU
            </button>
          </form>
        )}

      </div>
    </div>
  );
}