import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Link, Mail, Plus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

interface MagicLink {
  link_id: string;
  token: string;
  expires_at: string;
  magic_link_url: string;
}

export const MagicLinkGenerator = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [expiresIn, setExpiresIn] = useState<number>(24);
  const [metadata, setMetadata] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [vipUsers, setVipUsers] = useState<User[]>([]);
  const [generatedLink, setGeneratedLink] = useState<MagicLink | null>(null);

  // Load VIP users on component mount
  React.useEffect(() => {
    loadVipUsers();
  }, []);

  const loadVipUsers = async () => {
    try {
      // Get VIP user roles first
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['premium_user', 'moderator', 'admin', 'super_admin']);

      if (error) throw error;

      if (!userRoles || userRoles.length === 0) {
        setVipUsers([]);
        return;
      }

      // Get user profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userRoles.map(ur => ur.user_id));

      if (profilesError) throw profilesError;

      const users: User[] = userRoles.map(ur => {
        const profile = profiles?.find(p => p.user_id === ur.user_id);
        return {
          id: ur.user_id,
          email: `User ID: ${ur.user_id.slice(0, 8)}...`, // Show partial user ID since email is not accessible
          display_name: profile?.display_name || 'Unknown User',
          role: ur.role
        };
      });

      setVipUsers(users);
    } catch (error) {
      console.error('Error loading VIP users:', error);
      toast.error('Failed to load VIP users');
    }
  };

  const generateMagicLink = async () => {
    if (!selectedUser) {
      toast.error('Please select a VIP user');
      return;
    }

    setLoading(true);
    try {
      let parsedMetadata = {};
      if (metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(metadata);
        } catch (e) {
          throw new Error('Invalid JSON in metadata field');
        }
      }

      const response = await supabase.functions.invoke('generate-magic-link', {
        body: {
          target_user_id: selectedUser,
          expires_in_hours: expiresIn,
          metadata: parsedMetadata
        }
      });

      if (response.error) {
        throw response.error;
      }

      const { data } = response;
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate magic link');
      }

      setGeneratedLink(data);
      toast.success('Magic link generated successfully!');

    } catch (error: any) {
      console.error('Error generating magic link:', error);
      toast.error(error.message || 'Failed to generate magic link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const sendEmail = async (link: string, userEmail: string) => {
    try {
      // You can implement email sending here using Resend or another service
      toast.info('Email functionality not implemented yet. Please copy and send the link manually.');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const selectedUserData = vipUsers.find(u => u.id === selectedUser);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate Magic Link for VIP Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select VIP User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a VIP user" />
              </SelectTrigger>
              <SelectContent>
                {vipUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.display_name} ({user.email}) - {user.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires-in">Expires in (hours)</Label>
            <Input
              id="expires-in"
              type="number"
              min="1"
              max="168"
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value) || 24)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Metadata (JSON)</Label>
            <Textarea
              id="metadata"
              placeholder='{"source": "admin_panel", "campaign": "vip_access"}'
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={generateMagicLink} 
            disabled={loading || !selectedUser}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate Magic Link'}
          </Button>
        </CardContent>
      </Card>

      {generatedLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Generated Magic Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Magic Link URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={generatedLink.magic_link_url} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(generatedLink.magic_link_url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link ID</Label>
                <Input value={generatedLink.link_id} readOnly className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input 
                  value={new Date(generatedLink.expires_at).toLocaleString()} 
                  readOnly 
                  className="text-sm"
                />
              </div>
            </div>

            {selectedUserData && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(generatedLink.magic_link_url)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendEmail(generatedLink.magic_link_url, selectedUserData.email)}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};