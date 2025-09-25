import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, MapPin, User, FileText, Download } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  campaign_name: string;
  total_cost: number;
  status: string;
  notes?: string;
  created_at: string;
  noc_requested: boolean;
  noc_status: string;
  billboard: {
    id: string;
    title: string;
    location_address: string;
  };
  customer: {
    id: string;
    full_name: string;
    email: string;
    company_name?: string;
  };
}

export default function OwnerBookings() {
  console.log('OwnerBookings component rendering');
  const { profile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('Profile in OwnerBookings:', profile);

  const loadBookings = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        billboard:billboards(id, title, location_address, owner_id),
        customer:profiles(id, full_name, email, company_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } else {
      // Filter bookings to only show those for billboards owned by this user
      const ownerBookings = (data || []).filter(booking => 
        booking.billboard?.owner_id === profile.id
      );
      setBookings(ownerBookings);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, [profile]);

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Booking status updated',
      });
      loadBookings();
    }
  };

  const handleNocApproval = async (bookingId: string, approved: boolean) => {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        noc_status: approved ? 'approved' : 'rejected' 
      })
      .eq('id', bookingId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update NOC status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `NOC ${approved ? 'approved' : 'rejected'} successfully`,
      });
      loadBookings();
    }
  };

  const generateNOC = async (booking: Booking) => {
    // Generate a simple NOC document
    const nocContent = `
NO OBJECTION CERTIFICATE

Date: ${format(new Date(), 'PPP')}

This is to certify that we have no objection to the use of our billboard:

Billboard: ${booking.billboard.title}
Location: ${booking.billboard.location_address}
Campaign: ${booking.campaign_name}
Duration: ${format(new Date(booking.start_date), 'PPP')} to ${format(new Date(booking.end_date), 'PPP')}
Customer: ${booking.customer.full_name}
${booking.customer.company_name ? `Company: ${booking.customer.company_name}` : ''}

Approved by: ${profile?.full_name || 'Billboard Owner'}

This certificate is valid for the specified duration only.
    `;

    // Create and download the NOC
    const blob = new Blob([nocContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOC_${booking.campaign_name}_${booking.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'NOC generated and downloaded',
    });
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

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage customer bookings for your billboards
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
                      {booking.customer.full_name}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(booking.status)}
                  {booking.noc_requested && (
                    <Badge variant={booking.noc_status === 'approved' ? 'default' : 'secondary'}>
                      NOC {booking.noc_status.toUpperCase()}
                    </Badge>
                  )}
                  {(booking.status === 'confirmed' || booking.status === 'active') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateNOC(booking)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Generate NOC
                    </Button>
                  )}
                  {booking.noc_status === 'pending' && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => generateNOC(booking)}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      Approve NOC Request
                    </Button>
                  )}
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
                  <div className="text-muted-foreground">Customer Email</div>
                  <div className="font-medium">{booking.customer.email}</div>
                </div>
              </div>

              {booking.customer.company_name && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Company: </span>
                  <span className="font-medium">{booking.customer.company_name}</span>
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
                {booking.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(booking.id, 'active')}
                  >
                    Mark Active
                  </Button>
                )}
                {booking.status === 'active' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusChange(booking.id, 'completed')}
                  >
                    Mark Completed
                  </Button>
                )}
                {booking.noc_status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleNocApproval(booking.id, true)}
                    >
                      Approve NOC
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleNocApproval(booking.id, false)}
                    >
                      Reject NOC
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground text-center">
              Customer bookings for your billboards will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}