import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, DollarSign, Eye, Target, TrendingUp, Pause, Play, Settings } from "lucide-react";

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: "Summer Sale 2024",
      status: "active",
      budget: 15000,
      spent: 8500,
      impressions: 250000,
      clicks: 1250,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      billboards: 3,
      ctr: 0.5
    },
    {
      id: 2,
      name: "Brand Awareness Q3",
      status: "paused",
      budget: 25000,
      spent: 12000,
      impressions: 180000,
      clicks: 900,
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      billboards: 5,
      ctr: 0.5
    },
    {
      id: 3,
      name: "Product Launch",
      status: "completed",
      budget: 10000,
      spent: 9800,
      impressions: 320000,
      clicks: 1600,
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      billboards: 2,
      ctr: 0.5
    },
    {
      id: 4,
      name: "Holiday Promotion",
      status: "scheduled",
      budget: 20000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      startDate: "2024-11-15",
      endDate: "2024-12-31",
      billboards: 4,
      ctr: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'paused':
        return <Badge className="bg-warning text-warning-foreground">Paused</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-info text-info-foreground">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        );
      case 'paused':
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Play className="h-3 w-3 mr-1" />
              Resume
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        );
      case 'scheduled':
        return (
          <Button size="sm" variant="outline">
            <Settings className="h-3 w-3 mr-1" />
            Edit
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your advertising campaigns and track performance
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active (1)</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled (1)</TabsTrigger>
          <TabsTrigger value="completed">Completed (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$70,000</div>
                <p className="text-xs text-muted-foreground">
                  Across all campaigns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">750K</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.52%</div>
                <p className="text-xs text-muted-foreground">
                  +0.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Campaign List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                        <span>{campaign.billboards} billboards</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(campaign.status)}
                      {getStatusActions(campaign.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">
                          ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {((campaign.spent / campaign.budget) * 100).toFixed(1)}% spent
                      </p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Impressions</p>
                        <p className="text-lg font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Clicks</p>
                        <p className="text-lg font-semibold">{campaign.clicks.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* CTR */}
                    <div>
                      <p className="text-sm text-muted-foreground">Click-through Rate</p>
                      <p className="text-2xl font-bold text-primary">{campaign.ctr}%</p>
                      <p className="text-xs text-muted-foreground">Industry avg: 0.4%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Active Campaigns</h3>
            <p className="text-muted-foreground">View and manage your currently running campaigns</p>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Scheduled Campaigns</h3>
            <p className="text-muted-foreground">Campaigns set to launch in the future</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Completed Campaigns</h3>
            <p className="text-muted-foreground">Review performance of past campaigns</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Campaigns;