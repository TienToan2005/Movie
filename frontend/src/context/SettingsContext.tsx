'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface Settings {
  siteName: string;
  primaryColor: string;
}

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'TOANMOVIE',
    primaryColor: '#dc2626',
  });

  const fetchSettings = async () => {
    console.log("Đang lấy dữ liệu cấu hình...");
    try {
      const res = await api.get('/admin/dashboard/public/settings');
      const { site_name, primary_color } = res.data.data;
      setSettings({
        siteName: site_name || 'TOANMOVIE',
        primaryColor: primary_color || '#dc2626',
      });

      if (site_name) {
       document.title = `${site_name} | Phim hay | Xem phim Online`;
      }
      document.documentElement.style.setProperty('--primary-color', primary_color);
    } catch (err) {
      console.error("Lỗi fetch settings:", err);
    }
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings phải được dùng trong SettingsProvider');
  return context;
};
