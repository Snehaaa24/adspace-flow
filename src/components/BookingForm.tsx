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
import { CalendarIcon, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      campaign_name: '',
      notes: '',
      noc_category: '',
    },
  });

  // Reset form and state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
      setShowPayment(false);
      setBookingData(null);
      setIsProcessing(false);
    }
  }, [open, form]);

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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!bookingData || !profile || !billboard) return;

    setIsProcessing(true);

    const days = Math.ceil((bookingData.end_date.getTime() - bookingData.start_date.getTime()) / (1000 * 60 * 60 * 24));
    const totalCost = Math.round((days / 30) * billboard.price_per_month);
    const amountInPaise = totalCost * 100;

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create booking first with pending status
      const { data: booking, error: bookingError } = await supabase.from('bookings').insert({
        billboard_id: billboard.id,
        customer_id: profile.user_id,
        start_date: bookingData.start_date.toISOString().split('T')[0],
        end_date: bookingData.end_date.toISOString().split('T')[0],
        campaign_name: bookingData.campaign_name,
        notes: bookingData.notes,
        total_cost: totalCost,
        status: 'pending',
        payment_status: 'pending',
        noc_status: bookingData.noc_category ? 'pending' : 'not_applied',
        noc_category: bookingData.noc_category || null,
      }).select().single();

      if (bookingError) throw bookingError;

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: amountInPaise,
          currency: 'INR',
          receipt: booking.id,
          notes: {
            billboard_id: billboard.id,
            campaign_name: bookingData.campaign_name,
          },
        },
      });

      if (orderError) throw orderError;

      // Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: amountInPaise,
        currency: 'INR',
        name: 'AdWiseManager',
        description: `Booking for ${billboard.title}`,
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: booking.id,
              },
            });

            if (verifyError) throw verifyError;

            toast({
              title: 'Payment Successful',
              description: 'Your billboard has been booked successfully!',
            });
            form.reset();
            setShowPayment(false);
            setBookingData(null);
            onOpenChange(false);
            onSuccess?.();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support if amount was deducted.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          email: profile.email,
          name: profile.full_name || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You can try again when ready.',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
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
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm} className="flex-1" disabled={isProcessing}>
                  Back
                </Button>
                <Button onClick={handlePayment} className="flex-1" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalCost}`
                  )}
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