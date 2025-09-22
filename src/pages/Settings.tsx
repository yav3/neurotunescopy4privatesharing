import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Customize your therapy and app preferences</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Display Name</div>
                  <div className="text-sm text-muted-foreground">How others see you</div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Email Preferences</div>
                  <div className="text-sm text-muted-foreground">Manage communication settings</div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Session Reminders</div>
                  <div className="text-sm text-muted-foreground">Get reminded about scheduled sessions</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Progress Updates</div>
                  <div className="text-sm text-muted-foreground">Weekly progress summaries</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">New Content</div>
                  <div className="text-sm text-muted-foreground">Notifications about new therapeutic content</div>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">Toggle dark/light theme</div>
                </div>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Reduced Motion</div>
                  <div className="text-sm text-muted-foreground">Minimize animations and transitions</div>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Data Sharing</div>
                  <div className="text-sm text-muted-foreground">Control how your data is used for research</div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">Export Data</div>
                  <div className="text-sm text-muted-foreground">Download your therapy data</div>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;