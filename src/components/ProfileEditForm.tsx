import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X, Save, User } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const therapeuticGoals = [
  'Focus Enhancement',
  'Anxiety Support', 
  'Stress Reduction',
  'Mood Boost',
  'Sleep Aid',
  'Meditation Support'
];

interface ProfileEditFormProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileEditForm({ isEditing, onSave, onCancel }: ProfileEditFormProps) {
  const { user, updateProfile } = useAuthContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    display_name: user?.profile?.display_name || '',
    bio: user?.profile?.bio || '',
    default_session_duration: user?.profile?.default_session_duration || 15,
    favorite_goals: user?.profile?.favorite_goals || [],
    notification_preferences: user?.profile?.notification_preferences || { email: true, push: false }
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive'
        });
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload avatar. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      favorite_goals: prev.favorite_goals.includes(goal)
        ? prev.favorite_goals.filter(g => g !== goal)
        : [...prev.favorite_goals, goal]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let updates: any = { ...formData };
      
      // Handle avatar upload
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile);
        if (avatarUrl) {
          updates.avatar_url = avatarUrl;
        }
      }
      
      const result = await updateProfile(updates);
      
      if (result?.success) {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
        onSave();
      } else {
        throw new Error(result?.error || 'Update failed');
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not update profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage 
              src={user?.profile?.avatar_url || ''} 
              alt={user?.profile?.display_name || 'User'} 
            />
            <AvatarFallback className="text-lg">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">
              {user?.profile?.display_name || user?.email || 'User'}
            </h2>
            <p className="text-muted-foreground">
              {user?.profile?.bio || 'No bio yet'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Favorite Goals</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.profile?.favorite_goals?.length > 0 ? (
                user.profile.favorite_goals.map((goal: string) => (
                  <Badge key={goal} variant="secondary">{goal}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No goals selected</span>
              )}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Default Session</Label>
            <p className="text-sm mt-1">
              {user?.profile?.default_session_duration || 15} minutes
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={avatarPreview || user?.profile?.avatar_url || ''} 
                alt="Profile" 
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {avatarPreview && (
              <button
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Enter your display name"
              className="mt-1"
            />
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <Label htmlFor="bio" className="text-base font-medium">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself and your therapeutic music journey..."
            className="mt-2 min-h-[100px] text-base"
          />
        </div>

        {/* Favorite Goals */}
        <div>
          <Label className="text-base font-medium">Favorite Therapeutic Goals</Label>
          <div className="flex flex-wrap gap-3 mt-3">
            {therapeuticGoals.map((goal) => (
              <Badge
                key={goal}
                variant={formData.favorite_goals.includes(goal) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-all px-4 py-2 text-sm font-medium"
                onClick={() => handleGoalToggle(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
          <p className="text-base text-foreground/90 mt-3">
            Click to toggle your favorite therapeutic goals
          </p>
        </div>

        {/* Session Preferences */}
        <div>
          <Label htmlFor="session_duration" className="text-base font-medium">Default Session Duration (minutes)</Label>
          <Input
            id="session_duration"
            type="number"
            min="5"
            max="120"
            value={formData.default_session_duration}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              default_session_duration: parseInt(e.target.value) || 15 
            }))}
            className="mt-2 max-w-32 text-base"
          />
        </div>

        {/* Notification Preferences */}
        <div>
          <Label className="text-base font-medium">Notification Preferences</Label>
          <div className="space-y-3 mt-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.notification_preferences.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notification_preferences: {
                    ...prev.notification_preferences,
                    email: e.target.checked
                  }
                }))}
                className="rounded border-input bg-background w-4 h-4"
              />
              <span className="text-base font-medium text-foreground">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.notification_preferences.push}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notification_preferences: {
                    ...prev.notification_preferences,
                    push: e.target.checked
                  }
                }))}
                className="rounded border-input bg-background w-4 h-4"
              />
              <span className="text-base font-medium text-foreground">Push notifications</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}