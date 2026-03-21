'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      
      const res = await api.get('/admin/dashboard/users'); 
      setUsers(res.data?.data || []);
    } catch (err) {
      toast.error("Lỗi lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: number, newRole: string) => {
    try {
      await api.put(`/admin/dashboard/users/${id}/role`, { role: newRole });
      toast.success("Đã cập nhật quyền hạn!");
      fetchUsers();
    } catch (err) {
      toast.error("Không thể đổi quyền!");
    }
  };

  if (loading) return <div className="p-10 text-white text-center">Đang tải danh sách người dùng...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-black mb-10 uppercase tracking-tighter">
        👥 Quản lý <span className="text-purple-500">NGƯỜI DÙNG</span>
      </h1>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-400 text-sm uppercase">
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Quyền hạn</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-all">
              <td className="p-4 font-bold">{user.username}</td>
              <td className="p-4 text-zinc-400 font-medium">{user.email}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
                  ${user.role?.includes('ADMIN') 
                    ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                  {user.role?.replace('ROLE_', '') || 'USER'}
                </span>
              </td>
              <td className="p-4 text-zinc-500 text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
              </td>
              <td className="p-4 text-center">
                <button 
                  onClick={() => handleChangeRole(user.id, user.role?.includes('ADMIN') ? 'USER' : 'ADMIN')}
                  className="text-[10px] uppercase font-bold bg-zinc-800 hover:bg-blue-600 px-3 py-2 rounded-lg transition-all flex items-center gap-2 mx-auto"
                >
                  🔄 Đổi quyền
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}