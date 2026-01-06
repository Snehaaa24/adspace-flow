import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.160.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = await req.json();

    // Get Razorpay secret from environment
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      throw new Error('Razorpay secret not configured');
    }

    console.log('Verifying payment for order:', razorpay_order_id);

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error('Invalid payment signature');
      throw new Error('Payment verification failed');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get booking details first
    const { data: booking, error: fetchError } = await supabaseClient
      .from('bookings')
      .select('customer_id, campaign_name, campaign_id, total_cost')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) {
      console.error('Error fetching booking:', fetchError);
      throw new Error('Failed to fetch booking details');
    }

    let campaignId = booking.campaign_id;

    // If no campaign exists, create one automatically
    if (!campaignId) {
      const { data: newCampaign, error: campaignError } = await supabaseClient
        .from('campaigns')
        .insert({
          customer_id: booking.customer_id,
          name: booking.campaign_name,
          description: `Auto-created campaign from billboard booking`,
          budget: booking.total_cost,
          status: 'active'
        })
        .select('id')
        .single();

      if (campaignError) {
        console.error('Error creating campaign:', campaignError);
        // Don't fail the payment, just log the error
      } else {
        campaignId = newCampaign.id;
      }
    }

    // Update booking with payment details and campaign link
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        status: 'confirmed',
        campaign_id: campaignId
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      throw new Error('Failed to update booking');
    }

    console.log('Payment verified and booking updated successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});