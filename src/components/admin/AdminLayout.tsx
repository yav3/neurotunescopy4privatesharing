import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

export function AdminLayout() {
  const { user, userRole } = useAuthContext();

  // Check if user is admin or super_admin
  if (!user || !['admin', 'super_admin'].includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger */}
          <header className="h-14 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 bg-muted/10">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}