import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Clock, Activity, MousePointer, Eye, LogOut, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UserEvent {
  id: string;
  event_type: string;
  event_data: any;
  timestamp: string;
  session_id?: string;
  user_id?: string;
}

interface UserSession {
  session_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  pages_visited: number;
  events: UserEvent[];
}

export function SingleUserJourneyDebugger() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const loadUserJourney = async () => {
    if (!userId && !userEmail) return;

    setLoading(true);
    try {
      let targetUserId = userId;

      // If email provided, find user_id
      if (userEmail && !userId) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .ilike("display_name", `%${userEmail}%`)
          .limit(1);
        
        if (profiles && profiles.length > 0) {
          targetUserId = profiles[0].user_id;
          setUserInfo(profiles[0]);
        }
      }

      if (!targetUserId) {
        console.error("User not found");
        return;
      }

      // Load user sessions
      const { data: sessionData } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

      // Load listening sessions for additional context
      const { data: listeningSessions } = await supabase
        .from("listening_sessions")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });

      // Combine and structure the data
      const sessionMap = new Map<string, UserSession>();

      // Process user sessions
      sessionData?.forEach(session => {
        const sessionId = session.id;
        sessionMap.set(sessionId, {
          session_id: sessionId,
          start_time: session.created_at,
          end_time: session.last_accessed,
          duration_seconds: session.last_accessed 
            ? Math.floor((new Date(session.last_accessed).getTime() - new Date(session.created_at).getTime()) / 1000)
            : undefined,
          pages_visited: 0,
          events: [{
            id: `session-start-${sessionId}`,
            event_type: "session_start",
            event_data: session.device_info as any || {},
            timestamp: session.created_at,
            session_id: sessionId,
            user_id: targetUserId
          }]
        });
      });

      // Add listening sessions as events
      listeningSessions?.forEach(session => {
        const sessionId = session.id;
        const events: UserEvent[] = [
          {
            id: `listening-start-${sessionId}`,
            event_type: "listening_session_start",
            event_data: {
              duration_minutes: session.session_duration_minutes,
              tracks_played: session.tracks_played,
              skip_rate: session.skip_rate,
              dominant_genres: session.dominant_genres
            },
            timestamp: session.session_date,
            user_id: targetUserId
          }
        ];

        // Try to match with user session by date
        const sessionDate = new Date(session.session_date);
        let matchedSession: UserSession | undefined;

        for (const [sid, userSession] of sessionMap) {
          const sessionStart = new Date(userSession.start_time);
          const timeDiff = Math.abs(sessionDate.getTime() - sessionStart.getTime());
          
          // If within 5 minutes, consider it the same session
          if (timeDiff < 5 * 60 * 1000) {
            matchedSession = userSession;
            break;
          }
        }

        if (matchedSession) {
          matchedSession.events.push(...events);
        } else {
          // Create new session for this listening session
          sessionMap.set(sessionId, {
            session_id: sessionId,
            start_time: session.session_date,
            duration_seconds: (session.session_duration_minutes || 0) * 60,
            pages_visited: 0,
            events
          });
        }
      });

      // Sort events within each session
      sessionMap.forEach(session => {
        session.events.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        session.pages_visited = session.events.filter(e => 
          e.event_type === "page_view" || e.event_type === "listening_session_start"
        ).length;
      });

      setSessions(Array.from(sessionMap.values()));
    } catch (error) {
      console.error("Error loading user journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "session_start": return <LogOut className="h-4 w-4 rotate-180" />;
      case "page_view": return <Eye className="h-4 w-4" />;
      case "listening_session_start": return <Activity className="h-4 w-4" />;
      case "user_interaction": return <MousePointer className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "session_start": return "bg-primary/10 border-primary/20";
      case "page_view": return "bg-blue-500/10 border-blue-500/20";
      case "listening_session_start": return "bg-accent/10 border-accent/20";
      case "user_interaction": return "bg-secondary/10 border-secondary/20";
      default: return "bg-muted/10 border-muted/20";
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Single User Journey Debugger
          </h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter User ID..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground self-center">or</span>
            <Input
              placeholder="Enter Email/Name..."
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadUserJourney} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Loading..." : "Debug"}
            </Button>
          </div>

          {userInfo && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>User:</strong> {userInfo.display_name} 
                <span className="ml-2 text-muted-foreground">({userInfo.user_id})</span>
              </p>
            </div>
          )}
        </div>

        {sessions.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Session List */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sessions ({sessions.length})
              </h4>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => setSelectedSession(session.session_id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSession === session.session_id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {new Date(session.start_time).toLocaleString()}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {session.events.length} events
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(session.duration_seconds)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Event Timeline */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Event Timeline
              </h4>
              {selectedSession ? (
                <ScrollArea className="h-[600px]">
                  {sessions
                    .find(s => s.session_id === selectedSession)
                    ?.events.map((event, idx) => (
                      <div key={event.id}>
                        <div className="flex gap-3 py-3">
                          <div className={`p-2 rounded-lg border h-fit ${getEventColor(event.event_type)}`}>
                            {getEventIcon(event.event_type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm capitalize">
                                {event.event_type.replace(/_/g, " ")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            {event.event_data && (
                              <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(event.event_data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                        {idx < (sessions.find(s => s.session_id === selectedSession)?.events.length || 0) - 1 && (
                          <Separator />
                        )}
                      </div>
                    ))}
                </ScrollArea>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                  Select a session to view events
                </div>
              )}
            </Card>
          </div>
        )}

        {!loading && sessions.length === 0 && (userId || userEmail) && (
          <div className="text-center py-12 text-muted-foreground">
            No sessions found for this user
          </div>
        )}
      </div>
    </Card>
  );
}
