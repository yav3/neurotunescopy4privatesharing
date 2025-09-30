import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Heart, 
  Ban, 
  MousePointer,
  Eye,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  Clock,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface UserJourneyEvent {
  timestamp: string;
  event_type: string;
  page: string;
  duration_seconds?: number;
  details?: any;
}

interface UserJourney {
  user_id: string;
  display_name: string;
  session_start: string;
  session_end?: string;
  events: UserJourneyEvent[];
  total_duration: number;
  pages_visited: number;
}

export const UserJourneyVisualization: React.FC = () => {
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJourneys, setExpandedJourneys] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUserJourneys();
  }, []);

  const loadUserJourneys = async () => {
    setLoading(true);
    try {
      // Get recent listening sessions with user info
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select(`
          user_id,
          session_date,
          session_duration_minutes,
          tracks_played,
          dominant_genres
        `)
        .order('session_date', { ascending: false })
        .limit(50);

      // Get user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name');

      // Get user sessions with activity
      const { data: userSessions } = await supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Build journey data from available information
      const journeyMap = new Map<string, UserJourney>();

      sessions?.forEach(session => {
        const profile = profiles?.find(p => p.user_id === session.user_id);
        const journeyKey = `${session.user_id}-${session.session_date}`;
        
        if (!journeyMap.has(journeyKey)) {
          journeyMap.set(journeyKey, {
            user_id: session.user_id,
            display_name: profile?.display_name || 'Anonymous',
            session_start: session.session_date,
            session_end: new Date(new Date(session.session_date).getTime() + (session.session_duration_minutes || 0) * 60000).toISOString(),
            events: [],
            total_duration: session.session_duration_minutes || 0,
            pages_visited: 1
          });
        }

        const journey = journeyMap.get(journeyKey)!;
        
        // Add session start event
        journey.events.push({
          timestamp: session.session_date,
          event_type: 'session_start',
          page: '/therapeutic',
          details: { genres: session.dominant_genres }
        });

        // Add play events
        if (session.tracks_played > 0) {
          journey.events.push({
            timestamp: new Date(new Date(session.session_date).getTime() + 30000).toISOString(),
            event_type: 'track_play',
            page: '/therapeutic',
            details: { count: session.tracks_played }
          });
        }

        // Add session end event
        if (session.session_duration_minutes > 0) {
          journey.events.push({
            timestamp: journey.session_end!,
            event_type: 'session_end',
            page: '/therapeutic',
            duration_seconds: session.session_duration_minutes * 60
          });
        }
      });

      // Add user session data
      userSessions?.forEach(userSession => {
        const profile = profiles?.find(p => p.user_id === userSession.user_id);
        const journeyKey = `${userSession.user_id}-${userSession.created_at}`;
        
        if (!journeyMap.has(journeyKey)) {
          journeyMap.set(journeyKey, {
            user_id: userSession.user_id,
            display_name: profile?.display_name || 'Anonymous',
            session_start: userSession.created_at,
            session_end: userSession.expires_at,
            events: [],
            total_duration: 0,
            pages_visited: 0
          });
        }

        const journey = journeyMap.get(journeyKey)!;
        journey.events.push({
          timestamp: userSession.created_at,
          event_type: 'login',
          page: '/',
          details: { device: (userSession.device_info as any)?.device }
        });
      });

      const sortedJourneys = Array.from(journeyMap.values())
        .sort((a, b) => new Date(b.session_start).getTime() - new Date(a.session_start).getTime())
        .slice(0, 20);

      setJourneys(sortedJourneys);
    } catch (error) {
      console.error('Error loading user journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJourney = (userId: string) => {
    setExpandedJourneys(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'session_start': return <LogIn className="w-4 h-4 text-primary" />;
      case 'session_end': return <LogOut className="w-4 h-4 text-muted-foreground" />;
      case 'track_play': return <Play className="w-4 h-4 text-success" />;
      case 'track_skip': return <ArrowRight className="w-4 h-4 text-warning" />;
      case 'favorite': return <Heart className="w-4 h-4 text-destructive" />;
      case 'block': return <Ban className="w-4 h-4 text-destructive" />;
      case 'page_view': return <Eye className="w-4 h-4" />;
      case 'login': return <LogIn className="w-4 h-4 text-primary" />;
      case 'user_interaction': return <MousePointer className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'session_start':
      case 'login': return 'bg-primary/10 border-primary/20';
      case 'track_play': return 'bg-success/10 border-success/20';
      case 'favorite': return 'bg-destructive/10 border-destructive/20';
      case 'page_view': return 'bg-secondary border-secondary';
      default: return 'bg-muted border-border';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Journey Visualization</CardTitle>
          <CardDescription>Loading journey data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              User Journey Visualization
            </CardTitle>
            <CardDescription>
              Real-time tracking of individual user behavior and session flows
            </CardDescription>
          </div>
          <Button onClick={loadUserJourneys} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {journeys.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No user journey data available yet
              </div>
            ) : (
              journeys.map((journey, idx) => {
                const journeyKey = `${journey.user_id}-${journey.session_start}`;
                const isExpanded = expandedJourneys.has(journeyKey);
                
                return (
                  <Card key={journeyKey} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Journey #{idx + 1}</Badge>
                            <span className="font-medium">{journey.display_name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(journey.session_start), 'MMM d, h:mm a')}
                            </div>
                            <div>{journey.total_duration} min session</div>
                            <div>{journey.events.length} events</div>
                            <div>{journey.pages_visited} pages</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleJourney(journeyKey)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent>
                        <div className="space-y-3">
                          {journey.events
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((event, eventIdx) => (
                              <div
                                key={eventIdx}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${getEventColor(event.event_type)}`}
                              >
                                <div className="mt-0.5">
                                  {getEventIcon(event.event_type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {event.event_type.replace(/_/g, ' ')}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(event.timestamp), 'h:mm:ss a')}
                                    </span>
                                  </div>
                                  <div className="text-sm font-medium">{event.page}</div>
                                  {event.duration_seconds && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Duration: {Math.round(event.duration_seconds / 60)}m {event.duration_seconds % 60}s
                                    </div>
                                  )}
                                  {event.details && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {JSON.stringify(event.details, null, 2)
                                        .split('\n')
                                        .slice(0, 3)
                                        .join(' ')
                                        .replace(/[{}",]/g, '')
                                        .trim()}
                                    </div>
                                  )}
                                </div>
                                {eventIdx < journey.events.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-1" />
                                )}
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
