import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

const billboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  width: z.number().min(1, 'Width must be at least 1 meter'),
  height: z.number().min(1, 'Height must be at least 1 meter'),
  price_per_month: z.number().min(1, 'Price must be at least $1'),
  traffic_score: z.enum(['low', 'medium', 'high']),
  daily_impressions: z.number().min(0, 'Impressions cannot be negative'),
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
  
  const form = useForm<BillboardFormData>({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
      width: 6,
      height: 3,
      price_per_month: 3000,
      traffic_score: 'medium',
      daily_impressions: 5000,
      latitude: 40.7128,
      longitude: -74.0060,
    },
  });

  const onSubmit = async (data: BillboardFormData) => {
    if (!profile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a billboard',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('billboards').insert([{
      title: data.title,
      location: data.location,
      description: data.description,
      width: data.width,
      height: data.height,
      price_per_month: data.price_per_month,
      traffic_score: data.traffic_score,
      daily_impressions: data.daily_impressions,
      latitude: data.latitude,
      longitude: data.longitude,
      owner_id: profile.user_id,
    }]);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create billboard',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Billboard created successfully',
      });
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Billboard</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Month ($)</FormLabel>
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
                name="traffic_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traffic Score</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select traffic score" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="daily_impressions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Impressions</FormLabel>
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Billboard</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}