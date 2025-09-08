import React from 'react';
import { AuthProvider, useAuthContext } from '@/components/auth/AuthProvider';
import { AuthPage } from '@/components/auth/AuthPage';
import { User, Shield, Crown, Star, LogOut } from 'lucide-react';

function AuthenticatedContent() {
  const { user, loading, signOut, isAdmin, canManageUsers } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'admin': return <Shield className="w-5 h-5 text-red-400" />;
      case 'moderator': return <Star className="w-5 h-5 text-purple-400" />;
      case 'premium_user': return <Star className="w-5 h-5 text-blue-400" />;
      default: return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {getRoleIcon(user.role)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {user.profile?.display_name || user.email}!
                </h1>
                <p className="text-gray-300">Role: {user.role || 'user'}</p>
                <p className="text-gray-400 text-sm">ID: {user.id}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">User Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Role:</span>
                  <span className="text-white">{user.role || 'user'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Created:</span>
                  <span className="text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Is Admin:</span>
                  <span className={isAdmin() ? 'text-green-400' : 'text-red-400'}>
                    {isAdmin() ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Can Manage Users:</span>
                  <span className={canManageUsers() ? 'text-green-400' : 'text-red-400'}>
                    {canManageUsers() ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Email Verified:</span>
                  <span className={user.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}>
                    {user.email_confirmed_at ? 'Yes' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Data</h3>
              <div className="space-y-2 text-sm">
                {user.profile ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Display Name:</span>
                      <span className="text-white">{user.profile.display_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Profile Created:</span>
                      <span className="text-white">
                        {new Date(user.profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No profile data found</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <h4 className="font-semibold text-green-300 mb-2">✅ Authentication System Working!</h4>
            <p className="text-green-200 text-sm">
              The simplified auth system is now properly connected to your Supabase database with user roles support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthTest() {
  return (
    <AuthProvider>
      <AuthenticatedContent />
    </AuthProvider>
  );
}