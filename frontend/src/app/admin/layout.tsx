'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Thống kê', href: '/admin/dashboard', icon: '📊' },
    { name: 'Quản lý Phim', href: '/admin/manage', icon: '🎬' },
    { name: 'Người dùng', href: '/admin/users', icon: '👤' },
    { name: 'Cài đặt', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <Link href="/">
            <h2 className="text-2xl font-black text-red-600 tracking-tighter">
              TOAN<span className="text-white">MOVIE</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-900">
           <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-red-500 font-bold transition-all"
           >
            🚪 Đăng xuất
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}