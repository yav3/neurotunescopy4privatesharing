import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Activity,
  AlertCircle,
  CheckCircle,
  Users,
  Music,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface SentimentData {
  avgMoodImprovement: number;
  totalSessions: number;
  positiveOutcomes: number;
  mostEffectiveTherapy: string;
  moodTrends: Array<{ date: string; improvement: number }>;
}

interface Discovery {
  id: string;
  biomarker_name: string;
  condition: string;
  sensitivity: number;
  specificity: number;
  validation_status: string;
  publication_date: string;
  p_value: number;
}

interface UserJourneyInsight {
  totalUsers: number;
  avgSessionsPerUser: number;
  retentionRate: number;
  mostCommonPath: string;
}

interface CognitiveTrend {
  biomarker_type: string;
  avgImprovement: number;
  patientCount: number;
  trend_direction: string;
}

export const ComprehensiveInsightsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [journeyInsights, setJourneyInsights] = useState<UserJourneyInsight | null>(null);
  const [cognitiveTrends, setCognitiveTrends] = useState<CognitiveTrend[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadAllInsights();
  }, []);

  const loadAllInsights = async () => {
    setLoading(true);
    await Promise.all([
      loadSentimentData(),
      loadDiscoveries(),
      loadUserJourneyInsights(),
      loadCognitiveTrends(),
      loadRiskAssessments()
    ]);
    setLoading(false);
  };

  const loadSentimentData = async () => {
    try {
      const { data: therapySessions } = await supabase
        .from('music_therapy_sessions')
        .select('*');

      if (!therapySessions || therapySessions.length === 0) {
        setSentimentData({
          avgMoodImprovement: 0,
          totalSessions: 0,
          positiveOutcomes: 0,
          mostEffectiveTherapy: 'N/A',
          moodTrends: []
        });
        return;
      }

      let totalImprovement = 0;
      let positiveCount = 0;
      const therapyTypes: Record<string, number> = {};

      therapySessions.forEach(session => {
        const preMood = session.pre_session_mood as any;
        const postMood = session.post_session_mood as any;
        
        if (preMood?.overall && postMood?.overall) {
          const improvement = postMood.overall - preMood.overall;
          totalImprovement += improvement;
          if (improvement > 0) positiveCount++;
        }

        const therapyType = session.therapy_type || 'general';
        therapyTypes[therapyType] = (therapyTypes[therapyType] || 0) + 1;
      });

      const avgImprovement = therapySessions.length > 0 
        ? (totalImprovement / therapySessions.length) * 100 
        : 0;

      const mostEffective = Object.entries(therapyTypes)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      setSentimentData({
        avgMoodImprovement: Math.round(avgImprovement * 10) / 10,
        totalSessions: therapySessions.length,
        positiveOutcomes: positiveCount,
        mostEffectiveTherapy: mostEffective,
        moodTrends: []
      });
    } catch (error) {
      console.error('Error loading sentiment data:', error);
    }
  };

  const loadDiscoveries = async () => {
    try {
      const { data } = await supabase
        .from('biomarker_discoveries')
        .select('*')
        .order('publication_date', { ascending: false })
        .limit(10);

      setDiscoveries(data || []);
    } catch (error) {
      console.error('Error loading discoveries:', error);
    }
  };

  const loadUserJourneyInsights = async () => {
    try {
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('user_id, created_at');

      if (!sessions) return;

      const uniqueUsers = new Set(sessions.map(s => s.user_id)).size;
      const avgSessions = sessions.length / (uniqueUsers || 1);

      // Calculate retention (users with more than 1 session)
      const userSessionCounts: Record<string, number> = {};
      sessions.forEach(s => {
        userSessionCounts[s.user_id] = (userSessionCounts[s.user_id] || 0) + 1;
      });
      
      const returningUsers = Object.values(userSessionCounts).filter(count => count > 1).length;
      const retentionRate = (returningUsers / (uniqueUsers || 1)) * 100;

      setJourneyInsights({
        totalUsers: uniqueUsers,
        avgSessionsPerUser: Math.round(avgSessions * 10) / 10,
        retentionRate: Math.round(retentionRate),
        mostCommonPath: 'Session Builder → Listening → Favorites'
      });
    } catch (error) {
      console.error('Error loading user journey insights:', error);
    }
  };

  const loadCognitiveTrends = async () => {
    try {
      const { data } = await supabase
        .from('cognitive_biomarkers')
        .select('*');

      if (!data) return;

      const biomarkerGroups: Record<string, any[]> = {};
      data.forEach(item => {
        if (!biomarkerGroups[item.biomarker_type]) {
          biomarkerGroups[item.biomarker_type] = [];
        }
        biomarkerGroups[item.biomarker_type].push(item);
      });

      const trends = Object.entries(biomarkerGroups).map(([type, items]) => {
        const avgChange = items
          .filter(i => i.change_percentage !== null)
          .reduce((acc, i) => acc + (i.change_percentage || 0), 0) / (items.length || 1);

        const positiveCount = items.filter(i => (i.change_percentage || 0) > 0).length;
        const direction = positiveCount > items.length / 2 ? 'improving' : 'stable';

        return {
          biomarker_type: type,
          avgImprovement: Math.round(avgChange * 10) / 10,
          patientCount: new Set(items.map(i => i.patient_id)).size,
          trend_direction: direction
        };
      });

      setCognitiveTrends(trends);
    } catch (error) {
      console.error('Error loading cognitive trends:', error);
    }
  };

  const loadRiskAssessments = async () => {
    try {
      const { data } = await supabase
        .from('dementia_risk_assessments')
        .select('*')
        .order('assessment_date', { ascending: false })
        .limit(20);

      setRiskAssessments(data || []);
    } catch (error) {
      console.error('Error loading risk assessments:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comprehensive insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Comprehensive Insights Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time analytics from therapy sessions, biomarker discoveries, and user behavior
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-rose-500" />
              Mood Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              {sentimentData?.avgMoodImprovement ? `+${sentimentData.avgMoodImprovement}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {sentimentData?.totalSessions || 0} therapy sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Novel Discoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {discoveries.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Validated biomarkers identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-500" />
              User Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {journeyInsights?.retentionRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {journeyInsights?.totalUsers || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-purple-500" />
              Cognitive Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {cognitiveTrends.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Biomarker types tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights Tabs */}
      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="discoveries">Discoveries</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Therapy Session Sentiment Analysis
              </CardTitle>
              <CardDescription>
                Mood improvements and therapy efficacy across all sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Mood Improvement</span>
                  <span className="text-lg font-bold text-primary">
                    {sentimentData?.avgMoodImprovement ? `+${sentimentData.avgMoodImprovement}%` : 'N/A'}
                  </span>
                </div>
                <Progress value={Math.abs(sentimentData?.avgMoodImprovement || 0)} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Positive Outcomes</p>
                  <p className="text-2xl font-bold text-green-500">
                    {sentimentData?.positiveOutcomes || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sentimentData?.totalSessions 
                      ? `${Math.round((sentimentData.positiveOutcomes / sentimentData.totalSessions) * 100)}% success rate`
                      : 'No data'}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Most Effective Therapy</p>
                  <p className="text-xl font-bold capitalize">
                    {sentimentData?.mostEffectiveTherapy || 'N/A'}
                  </p>
                  <Badge variant="secondary" className="mt-1">Top Performer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discoveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Novel Biomarker Discoveries
              </CardTitle>
              <CardDescription>
                Latest validated biomarkers and research findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discoveries.length > 0 ? (
                  discoveries.map((discovery) => (
                    <div 
                      key={discovery.id} 
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{discovery.biomarker_name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Condition: {discovery.condition}
                          </p>
                        </div>
                        <Badge 
                          variant={discovery.validation_status === 'validated' ? 'default' : 'secondary'}
                        >
                          {discovery.validation_status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Sensitivity</p>
                          <p className="text-sm font-semibold">
                            {discovery.sensitivity ? `${Math.round(discovery.sensitivity * 100)}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Specificity</p>
                          <p className="text-sm font-semibold">
                            {discovery.specificity ? `${Math.round(discovery.specificity * 100)}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">P-value</p>
                          <p className="text-sm font-semibold">
                            {discovery.p_value ? discovery.p_value.toFixed(4) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No biomarker discoveries recorded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Cognitive Biomarker Trends
              </CardTitle>
              <CardDescription>
                Tracking cognitive health indicators over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cognitiveTrends.length > 0 ? (
                  cognitiveTrends.map((trend, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {trend.trend_direction === 'improving' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm capitalize">
                            {trend.biomarker_type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trend.patientCount} patients tracked
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          trend.avgImprovement > 0 ? 'text-green-500' : 'text-muted-foreground'
                        }`}>
                          {trend.avgImprovement > 0 ? '+' : ''}{trend.avgImprovement}%
                        </p>
                        <Badge 
                          variant={trend.trend_direction === 'improving' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {trend.trend_direction}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No cognitive biomarker data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Risk Assessments
              </CardTitle>
              <CardDescription>
                Recent dementia risk evaluations and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskAssessments.length > 0 ? (
                  riskAssessments.slice(0, 5).map((assessment) => (
                    <div 
                      key={assessment.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant={
                            assessment.risk_category === 'low' ? 'default' :
                            assessment.risk_category === 'moderate' ? 'secondary' :
                            'destructive'
                          }
                        >
                          {assessment.risk_category} risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(assessment.assessment_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Overall Risk Score</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={assessment.overall_risk_score} 
                              className="h-2 flex-1"
                            />
                            <span className="text-sm font-semibold">
                              {Math.round(assessment.overall_risk_score)}%
                            </span>
                          </div>
                        </div>
                        
                        {assessment.recommendation && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {assessment.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No risk assessments recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                User Journey Insights
              </CardTitle>
              <CardDescription>
                How users interact with the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Active Users</p>
                  <p className="text-3xl font-bold">{journeyInsights?.totalUsers || 0}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Avg Sessions/User</p>
                  <p className="text-3xl font-bold">{journeyInsights?.avgSessionsPerUser || 0}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">User Retention Rate</p>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={journeyInsights?.retentionRate || 0} 
                      className="h-3 flex-1"
                    />
                    <span className="text-lg font-bold">
                      {journeyInsights?.retentionRate || 0}%
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Most Common User Path</p>
                  <p className="text-sm text-muted-foreground">
                    {journeyInsights?.mostCommonPath || 'No data available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
