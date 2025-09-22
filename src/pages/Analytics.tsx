import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, Eye, MousePointer, DollarSign, Target, Calendar } from "lucide-react";

const Analytics = () => {
  const impressionsData = [
    { name: 'Jan', impressions: 45000, clicks: 225 },
    { name: 'Feb', impressions: 52000, clicks: 260 },
    { name: 'Mar', impressions: 48000, clicks: 240 },
    { name: 'Apr', impressions: 61000, clicks: 305 },
    { name: 'May', impressions: 58000, clicks: 290 },
    { name: 'Jun', impressions: 67000, clicks: 335 },
  ];

  const campaignPerformance = [
    { name: 'Times Square', value: 35, color: '#8B5CF6' },
    { name: 'Sunset Strip', value: 25, color: '#06B6D4' },
    { name: 'Downtown', value: 20, color: '#10B981' },
    { name: 'Highway 101', value: 20, color: '#F59E0B' },
  ];

  const dailyMetrics = [
    { date: '2024-09-15', impressions: 12500, ctr: 0.45, cost: 450 },
    { date: '2024-09-16', impressions: 13200, ctr: 0.52, cost: 480 },
    { date: '2024-09-17', impressions: 11800, ctr: 0.48, cost: 420 },
    { date: '2024-09-18', impressions: 14600, ctr: 0.55, cost: 520 },
    { date: '2024-09-19', impressions: 15200, ctr: 0.58, cost: 560 },
    { date: '2024-09-20', impressions: 13900, ctr: 0.51, cost: 495 },
    { date: '2024-09-21', impressions: 14800, ctr: 0.53, cost: 530 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track campaign performance and billboard metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30d">
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
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.51%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+0.08%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18.5K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impressions & Clicks Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Impressions & Clicks Over Time</CardTitle>
                <CardDescription>Monthly performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={impressionsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" />
                    <Bar dataKey="clicks" fill="hsl(var(--secondary))" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Distribution</CardTitle>
                <CardDescription>Share of impressions by location</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={campaignPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {campaignPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance Metrics</CardTitle>
              <CardDescription>Last 7 days detailed breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="impressions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Impressions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ctr" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    name="CTR (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Performance breakdown by individual campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Campaign-specific Analytics</h3>
                <p className="text-muted-foreground">Detailed performance metrics for each campaign</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
              <CardDescription>Billboard performance by geographic location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Geographic Performance</h3>
                <p className="text-muted-foreground">Performance metrics broken down by billboard locations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Long-term trends and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trend Analysis</h3>
                <p className="text-muted-foreground">Historical trends and performance forecasting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;