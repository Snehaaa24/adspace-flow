import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building2, Megaphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleRoleSelection = (role: 'customer' | 'owner') => {
    navigate(`/auth?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AdWiseManager
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The complete platform for billboard advertising management. Connect advertisers with premium billboard spaces.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Role</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Advertiser Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Advertiser</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Launch impactful campaigns and book premium billboard spaces
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Browse available billboard locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Create and manage advertising campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Apply for NOC approvals seamlessly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Track campaign performance and analytics</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleRoleSelection('customer')} 
                  className="w-full mt-6 group-hover:shadow-lg"
                  size="lg"
                >
                  Get Started as Advertiser
                </Button>
              </CardContent>
            </Card>

            {/* Billboard Owner Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-secondary">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Building2 className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">Billboard Owner</CardTitle>
                </div>
                <CardDescription className="text-base">
                  List and manage your billboard inventory efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>List your billboard properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Manage bookings and approvals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Process NOC applications efficiently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Track revenue and utilization</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => handleRoleSelection('owner')} 
                  className="w-full mt-6 group-hover:shadow-lg"
                  size="lg"
                  variant="secondary"
                >
                  Get Started as Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AdWiseManager?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seamless Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Streamlined process from booking to NOC approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay informed with instant notifications and status updates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrated payment processing with Razorpay
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
