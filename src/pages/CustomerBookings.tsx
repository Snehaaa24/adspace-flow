import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, MapPin, User, FileText, Download, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  campaign_name: string;
  total_cost: number;
  status: string;
  notes?: string;
  created_at: string;
  noc_requested?: boolean;
  noc_status: string;
  noc_category?: string;
  billboard: {
    id: string;
    title: string;
    location: string;
    owner_id: string;
    owner?: {
      user_id: string;
      full_name: string;
      email: string;
      company_name?: string;
    };
  };
}

export default function CustomerBookings() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [nocDialogOpen, setNocDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [nocCategory, setNocCategory] = useState<string>('');

  const loadBookings = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        billboard:billboards(
          id,
          title,
          location,
          owner_id,
          owner:profiles!billboards_owner_id_fkey(user_id, full_name, email, company_name)
        )
      `)
      .eq('customer_id', profile.user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, [profile]);

  const openNocDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setNocDialogOpen(true);
  };

  const applyForNOC = async () => {
    if (!nocCategory) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({ 
        noc_requested: true,
        noc_status: 'pending',
        noc_category: nocCategory
      })
      .eq('id', selectedBookingId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to request NOC',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'NOC request submitted successfully',
      });
      setNocDialogOpen(false);
      setNocCategory('');
      loadBookings();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary' as const,
      confirmed: 'default' as const,
      active: 'default' as const,
      completed: 'default' as const,
      cancelled: 'destructive' as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
  };

  const getNocStatusBadge = (nocStatus: string) => {
    const variants = {
      not_requested: 'secondary' as const,
      pending: 'secondary' as const,
      approved: 'default' as const,
      rejected: 'destructive' as const,
    };
    const labels = {
      not_requested: 'NOC Not Requested',
      pending: 'NOC Pending',
      approved: 'NOC Approved',
      rejected: 'NOC Rejected',
    };
    return (
      <Badge variant={variants[nocStatus as keyof typeof variants]}>
        {labels[nocStatus as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
          <p className="text-muted-foreground">
            View your billboard bookings and manage NOC requests
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{booking.campaign_name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {booking.billboard.title}
                    </span>
                    <span className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      Owner: {booking.billboard.owner?.full_name || 'Unknown'}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-col">
                  {getStatusBadge(booking.status)}
                  {getNocStatusBadge(booking.noc_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    Start Date
                  </div>
                  <div className="font-medium">{format(new Date(booking.start_date), 'MMM dd, yyyy')}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    End Date
                  </div>
                  <div className="font-medium">{format(new Date(booking.end_date), 'MMM dd, yyyy')}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-1 h-3 w-3" />
                    Total Cost
                  </div>
                  <div className="font-medium">${booking.total_cost}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Billboard Location</div>
                  <div className="font-medium">{booking.billboard.location}</div>
                </div>
              </div>

              {booking.billboard.owner?.company_name && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Owner Company: </span>
                  <span className="font-medium">{booking.billboard.owner.company_name}</span>
                </div>
              )}

              {booking.notes && (
                <div className="text-sm">
                  <div className="flex items-center text-muted-foreground mb-1">
                    <FileText className="mr-1 h-3 w-3" />
                    Notes
                  </div>
                  <p className="text-muted-foreground">{booking.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                {booking.noc_status === 'not_requested' && booking.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    onClick={() => openNocDialog(booking.id)}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Apply for NOC
                  </Button>
                )}
                {booking.noc_status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    NOC Request Pending
                  </Button>
                )}
                {booking.noc_status === 'approved' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled
                  >
                    <Download className="mr-1 h-3 w-3" />
                    NOC Approved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={nocDialogOpen} onOpenChange={setNocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for NOC</DialogTitle>
            <DialogDescription>
              Select the category for your NOC application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={nocCategory} onValueChange={setNocCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F&B">F&B</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNocDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyForNOC}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-center">
              Your billboard bookings will appear here after you make a booking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}