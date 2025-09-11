import React from 'react';
import { AuthProvider, useAuthContext } from '@/components/auth/AuthProvider';
import { AuthPage } from '@/components/auth/AuthPage';
import { User, Shield, Crown, Star, LogOut } from 'lucide-react';

function AuthenticatedContent() {
  const { user, loading, signOut, isAdmin, canManageUsers } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark-bg flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-8 border border-border shadow-glass-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                {getRoleIcon(user.role)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, {user.profile?.display_name || user.email}!
                </h1>
                <p className="text-muted-foreground">Role: {user.role || 'user'}</p>
                <p className="text-muted-foreground text-sm">ID: {user.id}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4">User Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="text-foreground">{user.role || 'user'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4">Permissions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Is Admin:</span>
                  <span className={isAdmin() ? 'text-green-400' : 'text-red-400'}>
                    {isAdmin() ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Can Manage Users:</span>
                  <span className={canManageUsers() ? 'text-green-400' : 'text-red-400'}>
                    {canManageUsers() ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Verified:</span>
                  <span className={user.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}>
                    {user.email_confirmed_at ? 'Yes' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-border/30">
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Data</h3>
              <div className="space-y-2 text-sm">
                {user.profile ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Display Name:</span>
                      <span className="text-foreground">{user.profile.display_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profile Created:</span>
                      <span className="text-foreground">
                        {new Date(user.profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No profile data found</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
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