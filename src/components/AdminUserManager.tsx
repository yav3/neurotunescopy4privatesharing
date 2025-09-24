import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AdminUserManager = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const resetUserPassword = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('Password reset email sent successfully');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // This would require admin access to auth.users table
      // For now, we'll just show what we can check
      toast.info('Check the Supabase dashboard for detailed user info');
    } catch (error) {
      console.error('User check error:', error);
      toast.error('Failed to check user status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin User Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div className="flex gap-2">
          <Button 
            onClick={resetUserPassword} 
            disabled={loading}
            variant="outline"
          >
            Reset Password
          </Button>
          <Button 
            onClick={checkUserStatus} 
            disabled={loading}
          >
            Check Status
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Known Issues:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>josh@neuralpositive.com - Has signed in before</li>
            <li>contact1@neuralpositive.com - Never completed first login</li>
          </ul>
          <p className="mt-2">
            <strong>Solution:</strong> Send password reset emails to both users so they can set new passwords and bypass any authentication issues.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};