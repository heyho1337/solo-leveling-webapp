import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import api from '@/services/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let user = null;
  if (token) {
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      user = response.data;
    } catch (error: any) {
      console.error('Failed to fetch user in server layout:', error.message);
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative bg-[url('/images/system/dashboard.png')] bg-cover bg-fixed bg-center">
      {/* New Premium Overlay - Global */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/15 via-[#0a0a0a]/85 to-[#000000]/98 backdrop-blur-[2px] z-0" />

      <div className="relative z-10 flex h-full w-full overflow-hidden">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Header user={user} />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-8 relative">
             {/* Decorative corner elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#38bdf8]/10 blur-[120px] -z-10" />
             {children}
          </main>
        </div>
      </div>
    </div>
  );
}
