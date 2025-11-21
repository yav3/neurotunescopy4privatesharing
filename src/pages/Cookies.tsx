import { useState } from 'react';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Cookies = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    therapeutic: true,
  });

  const handleSave = () => {
    // Save preferences to localStorage or send to backend
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    toast.success('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Preferences</h1>
        
        <section className="mb-8">
          <p className="text-muted-foreground mb-6">
            Manage your cookie preferences below. Essential cookies cannot be disabled as they are 
            required for the platform to function properly.
          </p>
        </section>

        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Essential Cookies</h3>
              <Switch checked={true} disabled />
            </div>
            <p className="text-muted-foreground text-sm">
              Required for basic site functionality, authentication, and security. These cookies 
              cannot be disabled.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Analytics Cookies</h3>
              <Switch 
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Help us understand how you use NeuroTunes so we can improve the platform. 
              Includes page views, session duration, and feature usage.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Marketing Cookies</h3>
              <Switch 
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, marketing: checked }))
                }
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Used to deliver relevant advertisements and track campaign effectiveness. 
              You can opt out without affecting your NeuroTunes experience.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Therapeutic Cookies</h3>
              <Switch 
                checked={preferences.therapeutic}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, therapeutic: checked }))
                }
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Track your listening patterns and therapeutic preferences to provide personalized 
              music recommendations. Disabling may reduce recommendation accuracy.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button onClick={handleSave} size="lg">
            Save Preferences
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              setPreferences({
                essential: true,
                analytics: false,
                marketing: false,
                therapeutic: false,
              });
            }}
          >
            Reject All Optional
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cookies;
