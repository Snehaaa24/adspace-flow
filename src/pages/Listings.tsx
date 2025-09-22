import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Eye, DollarSign, Calendar } from "lucide-react";

const Listings = () => {
  const billboards = [
    {
      id: 1,
      title: "Times Square Digital Billboard",
      location: "Times Square, NYC",
      price: 500,
      impressions: 50000,
      size: "14x8 ft",
      type: "Digital",
      status: "available",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Sunset Strip Premium",
      location: "West Hollywood, CA",
      price: 800,
      impressions: 75000,
      size: "20x10 ft",
      type: "Digital",
      status: "booked",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Downtown Financial District",
      location: "Financial District, NYC",
      price: 350,
      impressions: 30000,
      size: "12x6 ft",
      type: "Static",
      status: "available",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Highway 101 Billboard",
      location: "San Francisco Bay Area",
      price: 450,
      impressions: 40000,
      size: "16x8 ft",
      type: "Digital",
      status: "available",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Shopping District Display",
      location: "Michigan Avenue, Chicago",
      price: 600,
      impressions: 60000,
      size: "18x9 ft",
      type: "Digital",
      status: "maintenance",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Airport Terminal Board",
      location: "LAX Airport, CA",
      price: 900,
      impressions: 85000,
      size: "22x12 ft",
      type: "Digital",
      status: "available",
      image: "/placeholder.svg"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'booked':
        return <Badge variant="secondary">Booked</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billboard Listings</h1>
        <p className="text-muted-foreground">
          Browse and book premium billboard advertising spaces
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by location or title..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {billboards.map((billboard) => (
          <Card key={billboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-background rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Billboard Image</p>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{billboard.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {billboard.location}
                  </CardDescription>
                </div>
                {getStatusBadge(billboard.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{billboard.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{billboard.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Daily impressions:</span>
                  </div>
                  <span className="font-medium">{billboard.impressions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-xl font-bold text-primary">${billboard.price}</span>
                    <span className="text-muted-foreground">/day</span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={billboard.status !== 'available'}
                    className="gap-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {billboard.status === 'available' ? 'Book Now' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Listings;