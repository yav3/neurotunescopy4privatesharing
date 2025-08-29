import React, { useState, useEffect } from "react";
import { Search, Filter, X, Play, Clock, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { NowPlaying } from "@/components/NowPlaying";
import { useAudio } from "@/context/AudioContext";
import { API } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export const BrainwaveFrequencyPage = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { currentTrack, setPlaylist, loadTrack } = useAudio();

  const frequencyBands = [
    {
      id: "delta",
      name: "Delta",
      range: "0.5-4Hz",
      description: "Deep Sleep & Healing",
      color: "bg-blue-500",
      gradient: "from-blue-600 to-blue-800",
      trackCount: 0,
      icon: "🌙"
    },
    {
      id: "theta",
      name: "Theta", 
      range: "4-8Hz",
      description: "Meditation & Creativity",
      color: "bg-purple-500",
      gradient: "from-purple-600 to-purple-800",
      trackCount: 0,
      icon: "🧘"
    },
    {
      id: "alpha",
      name: "Alpha",
      range: "8-13Hz", 
      description: "Relaxed Focus",
      color: "bg-green-500",
      gradient: "from-green-600 to-green-800",
      trackCount: 50,
      icon: "🎯"
    },
    {
      id: "beta",
      name: "Beta",
      range: "13-30Hz",
      description: "Active Concentration", 
      color: "bg-orange-500",
      gradient: "from-orange-600 to-orange-800",
      trackCount: 0,
      icon: "⚡"
    },
    {
      id: "gamma",
      name: "Gamma",
      range: "30-100Hz",
      description: "Peak Performance",
      color: "bg-red-500", 
      gradient: "from-red-600 to-red-800",
      trackCount: 0,
      icon: "🚀"
    }
  ];

  const loadFrequencyTracks = async (frequency: string) => {
    setLoading(true);
    try {
      // Map frequency bands to goals for API compatibility
      const frequencyToGoal: { [key: string]: string } = {
        delta: "sleep",
        theta: "relax", 
        alpha: "focus",
        beta: "focus",
        gamma: "energy"
      };

      const goal = frequencyToGoal[frequency] || "focus";
      const { tracks: fetchedTracks } = await API.playlist(goal, 50, 0);
      setTracks(fetchedTracks);
      
      toast({
        title: `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Band Loaded`,
        description: `Found ${fetchedTracks.length} tracks for therapeutic use`,
      });
    } catch (error) {
      console.error("Failed to load tracks:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load frequency tracks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFrequencySelect = async (frequency: string) => {
    setSelectedFrequency(frequency);
    await loadFrequencyTracks(frequency);
  };

  const playAllTracks = async () => {
    if (tracks.length > 0) {
      const maxTracks = 50;
      const tracksToPlay = tracks.slice(0, maxTracks);
      
      setPlaylist(tracksToPlay);
      await loadTrack(tracksToPlay[0]);
      
      toast({
        title: "Playback Started",
        description: `Playing ${tracksToPlay.length} ${selectedFrequency} band tracks`,
      });
    }
  };

  const playTrack = async (track: any) => {
    await loadTrack(track);
  };

  const filteredTracks = tracks.filter(track =>
    track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">NeuroTunes Elite</h1>
              <p className="text-muted-foreground">Evidence-Based Therapeutic Music</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                API Connected
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 md:px-8 py-4">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-blue-500" />
            Clinical Research
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-purple-500" />
            Brainwave Entrainment
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            Therapeutic Applications
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 md:px-8 py-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, genres, or conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            All Conditions
          </Button>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </div>

      {/* Frequency Band Selection */}
      <div className="px-4 md:px-8 py-6">
        <h2 className="text-xl font-semibold mb-6">Select Brainwave Frequency</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {frequencyBands.map((band) => (
            <Card
              key={band.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedFrequency === band.id 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleFrequencySelect(band.id)}
            >
              <div className={`bg-gradient-to-br ${band.gradient} p-6 text-white`}>
                <div className="text-center">
                  <div className="text-2xl mb-2">{band.icon}</div>
                  <h3 className="text-lg font-semibold">{band.name}</h3>
                  <p className="text-sm opacity-90">{band.range}</p>
                  <p className="text-xs mt-2">{band.description}</p>
                  <div className="mt-4">
                    <Badge 
                      variant={band.trackCount > 0 ? "secondary" : "outline"}
                      className="bg-white/20 text-white border-white/30"
                    >
                      {band.trackCount} tracks {band.trackCount > 0 ? "available" : ""}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Track Listing */}
      {selectedFrequency && (
        <div className="px-4 md:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1)} Band Tracks
            </h2>
            <div className="flex gap-2">
              {tracks.length > 0 && (
                <>
                  <Button onClick={playAllTracks} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Play All
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Shuffle
                  </Button>
                  <Badge variant="outline">{filteredTracks.length} tracks</Badge>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading {selectedFrequency} band tracks...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTracks.map((track, index) => (
                <Card key={track.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/60 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{track.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{track.genre || "Classical"}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          N/A BPM
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          {selectedFrequency.charAt(0).toUpperCase() + selectedFrequency.slice(1)} Band
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {selectedFrequency === "alpha" ? "focus" : selectedFrequency}
                        </Badge>
                      </div>

                      {/* Energy and Valence bars */}
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Energy</span>
                            <span>{Math.round((track.energy || 0.4) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(track.energy || 0.4) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Valence</span>
                            <span>{Math.round((track.valence || 0.5) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(track.valence || 0.5) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm"
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredTracks.length === 0 && selectedFrequency && (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tracks found for the selected frequency band</p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFrequency(null)}
                className="mt-4"
              >
                Select Different Frequency
              </Button>
            </div>
          )}
        </div>
      )}

      <Navigation />
      {currentTrack && <NowPlaying />}
    </div>
  );
};