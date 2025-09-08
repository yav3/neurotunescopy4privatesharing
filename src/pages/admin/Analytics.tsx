import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, Music, Activity, TrendingUp, Clock, Headphones, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample data - in a real app, this would come from your analytics system
const userGrowthData = [
  { month: 'Jan', users: 1200, sessions: 3400 },
  { month: 'Feb', users: 1350, sessions: 3800 },
  { month: 'Mar', users: 1500, sessions: 4200 },
  { month: 'Apr', users: 1800, sessions: 4800 },
  { month: 'May', users: 2100, sessions: 5400 },
  { month: 'Jun', users: 2543, sessions: 6200 },
];

const contentUsageData = [
  { category: 'Focus Enhancement', plays: 8500, percentage: 35 },
  { category: 'Anxiety Relief', plays: 6200, percentage: 25 },
  { category: 'Sleep Aid', plays: 4800, percentage: 20 },
  { category: 'Mood Boost', plays: 3600, percentage: 15 },
  { category: 'Meditation', plays: 1200, percentage: 5 },
];

const sessionData = [
  { hour: '00:00', sessions: 45 },
  { hour: '04:00', sessions: 12 },
  { hour: '08:00', sessions: 180 },
  { hour: '12:00', sessions: 240 },
  { hour: '16:00', sessions: 320 },
  { hour: '20:00', sessions: 280 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Insights into user behavior, content performance, and system metrics.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Plays</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,300</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.4%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24m 32s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="therapeutic">Therapeutic Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly active users and sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="sessions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Session Pattern</CardTitle>
                <CardDescription>Sessions by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Key user insights and segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">New Users (7d)</h4>
                  <p className="text-2xl font-bold">324</p>
                  <p className="text-sm text-muted-foreground">+15% vs previous week</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Return Rate</h4>
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-sm text-muted-foreground">7-day return rate</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Premium Users</h4>
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">18% conversion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Category Performance</CardTitle>
                <CardDescription>Plays by therapeutic goal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="plays"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {contentUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Tracks</CardTitle>
                <CardDescription>Most played content this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Peaceful Morning", plays: 1250, category: "Focus Enhancement" },
                    { title: "Ocean Waves", plays: 980, category: "Sleep Aid" },
                    { title: "Forest Rain", plays: 876, category: "Anxiety Relief" },
                    { title: "Meditation Bell", plays: 743, category: "Meditation" },
                    { title: "Sunrise Energy", plays: 654, category: "Mood Boost" },
                  ].map((track, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{track.plays.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">plays</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Session Completion</CardTitle>
                <CardDescription>Users completing full sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">82%</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+5.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skip Rate</CardTitle>
                <CardDescription>Tracks skipped before completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12%</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-red-600">+1.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Favorite Rate</CardTitle>
                <CardDescription>Tracks added to favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">34%</div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Trends</CardTitle>
              <CardDescription>How users interact with the platform over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Daily Active Users</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="w-12 bg-primary h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly Active Users</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="w-14 bg-primary h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">88%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly Active Users</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div className="w-15 bg-primary h-2 rounded-full"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">94%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="therapeutic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mood Improvement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Users report positive change</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Better sleep reported</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Session completion rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anxiety Relief</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73%</div>
                <p className="text-xs text-muted-foreground">Stress reduction reported</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Therapeutic Outcomes</CardTitle>
              <CardDescription>User-reported benefits by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { goal: "Improved Sleep Quality", users: 1247, percentage: 85 },
                  { goal: "Reduced Anxiety", users: 1108, percentage: 73 },
                  { goal: "Better Focus", users: 1456, percentage: 92 },
                  { goal: "Mood Enhancement", users: 987, percentage: 78 },
                  { goal: "Stress Relief", users: 876, percentage: 68 },
                ].map((outcome, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{outcome.goal}</span>
                      <span className="text-sm text-muted-foreground">
                        {outcome.users} users ({outcome.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${outcome.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}