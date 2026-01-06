import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { LocationPicker } from '@/components/LocationPicker';
import { Loader2 } from 'lucide-react';

const billboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  width: z.number().min(1, 'Width must be at least 1 meter'),
  height: z.number().min(1, 'Height must be at least 1 meter'),
  price_per_month: z.number().min(1, 'Price must be at least ₹1'),
  latitude: z.number(),
  longitude: z.number(),
});

type BillboardFormData = z.infer<typeof billboardSchema>;

interface BillboardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BillboardForm({ open, onOpenChange, onSuccess }: BillboardFormProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BillboardFormData>({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
      width: 6,
      height: 3,
      price_per_month: 50000,
      latitude: 19.0760,
      longitude: 72.8777,
    },
  });

  const onSubmit = async (data: BillboardFormData) => {
    console.log('Form submitted with data:', data);
    
    if (!profile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a billboard',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch traffic data from TomTom API
      const { data: trafficData, error: trafficError } = await supabase.functions.invoke('get-traffic-data', {
        body: { latitude: data.latitude, longitude: data.longitude }
      });

      if (trafficError) {
        console.error('Traffic data fetch error:', trafficError);
        toast({
          title: 'Warning',
          description: 'Could not fetch traffic data, using default values',
        });
      }

      const trafficScore = trafficData?.trafficScore || 'medium';
      const dailyImpressions = trafficData?.dailyImpressions || 5000;

      console.log('Traffic data received:', { trafficScore, dailyImpressions });

      const { error } = await supabase.from('billboards').insert([{
        title: data.title,
        location: data.location,
        description: data.description,
        width: data.width,
        height: data.height,
        price_per_month: data.price_per_month,
        traffic_score: trafficScore,
        daily_impressions: dailyImpressions,
        latitude: data.latitude,
        longitude: data.longitude,
        owner_id: profile.user_id,
      }]);

      if (error) {
        console.error('Billboard creation error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to create billboard',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Billboard created with ${trafficScore} traffic score and ~${dailyImpressions.toLocaleString()} daily impressions`,
        });
        form.reset();
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFormError = (errors: any) => {
    console.log('Form validation errors:', errors);
    toast({
      title: 'Validation Error',
      description: 'Please check all required fields',
      variant: 'destructive',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Billboard</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Billboard title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (meters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (meters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price/Month (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <strong>Note:</strong> Traffic score and daily impressions will be automatically calculated from TomTom Traffic data based on the location you select.
            </div>

            <LocationPicker
              latitude={form.watch('latitude')}
              longitude={form.watch('longitude')}
              onLocationChange={async (lat, lng) => {
                form.setValue('latitude', lat);
                form.setValue('longitude', lng);
                
                // Reverse geocode to get address
                try {
                  const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                  );
                  const data = await response.json();
                  if (data.display_name) {
                    form.setValue('location', data.display_name);
                  }
                } catch (error) {
                  console.error('Reverse geocoding failed:', error);
                }
              }}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Traffic Data...
                  </>
                ) : (
                  'Create Billboard'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
