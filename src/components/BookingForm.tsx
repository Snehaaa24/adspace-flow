import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const bookingSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  campaign_name: z.string().min(1, 'Campaign name is required'),
  notes: z.string().optional(),
  noc_category: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Billboard {
  id: string;
  title: string;
  price_per_month: number;
  location: string;
}

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billboard: Billboard | null;
  onSuccess?: () => void;
}

export function BookingForm({ open, onOpenChange, billboard, onSuccess }: BookingFormProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      campaign_name: '',
      notes: '',
      noc_category: '',
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!profile || !billboard) {
      toast({
        title: 'Error',
        description: 'You must be logged in to make a booking',
        variant: 'destructive',
      });
      return;
    }

    if (data.end_date <= data.start_date) {
      toast({
        title: 'Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      });
      return;
    }

    setBookingData(data);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!bookingData || !profile || !billboard) return;

    const days = Math.ceil((bookingData.end_date.getTime() - bookingData.start_date.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = (days / 30) * billboard.price_per_month;

    const { error } = await supabase.from('bookings').insert({
      billboard_id: billboard.id,
      customer_id: profile.user_id,
      start_date: bookingData.start_date.toISOString().split('T')[0],
      end_date: bookingData.end_date.toISOString().split('T')[0],
      campaign_name: bookingData.campaign_name,
      notes: bookingData.notes,
      total_cost: totalCost,
      status: 'pending',
      noc_status: bookingData.noc_category ? 'pending' : 'not_applied',
      noc_category: bookingData.noc_category || null,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Billboard booked successfully!',
      });
      form.reset();
      setShowPayment(false);
      setBookingData(null);
      onOpenChange(false);
      onSuccess?.();
    }
  };

  const resetForm = () => {
    setShowPayment(false);
    setBookingData(null);
  };

  if (!billboard) return null;

  if (showPayment && bookingData) {
    const days = Math.ceil((bookingData.end_date.getTime() - bookingData.start_date.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = (days / 30) * billboard.price_per_month;
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Gateway</DialogTitle>
          </DialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billboard Booking
              </CardTitle>
              <CardDescription>
                Complete your booking payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Billboard:</span>
                  <span className="font-medium">{billboard.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campaign:</span>
                  <span className="font-medium">{bookingData.campaign_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{days} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per month:</span>
                  <span>${billboard.price_per_month}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${totalCost}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
                <Input placeholder="Cardholder Name" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1">
                  Pay ${totalCost}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Billboard: {billboard.title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes or requirements" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noc_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apply for NOC (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category for NOC application" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="F&B">F&B</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Fintech">Fintech</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Price per month:</span>
                <span className="font-bold">${billboard.price_per_month}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total cost will be calculated based on selected dates
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Continue to Payment</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}