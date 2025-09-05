import React from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Music, Clock } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 mb-24">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your therapeutic music preferences and session history
          </p>
        </div>

        <div className="grid gap-6">
          {/* User Info Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Music Therapy User</h2>
                <p className="text-muted-foreground">Therapeutic music enthusiast</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Music className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">127</div>
                <div className="text-sm text-muted-foreground">Sessions Complete</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">24h</div>
                <div className="text-sm text-muted-foreground">Total Listen Time</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">4</div>
                <div className="text-sm text-muted-foreground">Preferred Goals</div>
              </div>
            </div>
          </Card>

          {/* Preferences Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Therapeutic Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Favorite Goals</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Focus Enhancement</Badge>
                  <Badge variant="secondary">Anxiety Relief</Badge>
                  <Badge variant="secondary">Sleep Aid</Badge>
                  <Badge variant="secondary">Mood Boost</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Session Duration</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">15 minutes</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Focus Enhancement Session</p>
                  <p className="text-sm text-muted-foreground">15 minutes • Classical & Ambient</p>
                </div>
                <Badge variant="outline">Today</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Sleep Aid Session</p>
                  <p className="text-sm text-muted-foreground">30 minutes • Nature & Binaural</p>
                </div>
                <Badge variant="outline">Yesterday</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Mood Boost Session</p>
                  <p className="text-sm text-muted-foreground">20 minutes • Uplifting & Energetic</p>
                </div>
                <Badge variant="outline">2 days ago</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Navigation activeTab="profile" onTabChange={() => {}} />
    </div>
  );
};

export default Profile;