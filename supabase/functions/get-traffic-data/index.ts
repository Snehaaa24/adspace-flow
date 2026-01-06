import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();
    const TOMTOM_API_KEY = Deno.env.get('TOMTOM_API_KEY');

    if (!TOMTOM_API_KEY) {
      throw new Error('TOMTOM_API_KEY is not configured');
    }

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    // Fetch traffic flow data from TomTom
    const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${latitude},${longitude}&key=${TOMTOM_API_KEY}`;
    
    console.log('Fetching traffic data for:', { latitude, longitude });
    
    const response = await fetch(trafficUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TomTom API error:', response.status, errorText);
      throw new Error(`TomTom API error: ${response.status}`);
    }

    const trafficData = await response.json();
    console.log('Traffic data received:', trafficData);

    // Extract relevant traffic metrics
    const flowData = trafficData.flowSegmentData;
    
    // Calculate traffic score based on current speed vs free flow speed
    const currentSpeed = flowData?.currentSpeed || 0;
    const freeFlowSpeed = flowData?.freeFlowSpeed || 1;
    const speedRatio = currentSpeed / freeFlowSpeed;
    
    // Lower speed ratio = more congestion = higher traffic (good for billboards)
    let trafficScore: 'low' | 'medium' | 'high';
    let trafficDensity: number;
    
    if (speedRatio < 0.5) {
      trafficScore = 'high';
      trafficDensity = 90 + Math.random() * 10; // 90-100%
    } else if (speedRatio < 0.75) {
      trafficScore = 'medium';
      trafficDensity = 50 + Math.random() * 40; // 50-90%
    } else {
      trafficScore = 'low';
      trafficDensity = 10 + Math.random() * 40; // 10-50%
    }

    return new Response(
      JSON.stringify({
        success: true,
        trafficScore,
        trafficDensity: Math.round(trafficDensity),
        currentSpeed,
        freeFlowSpeed,
        speedRatio: Math.round(speedRatio * 100),
        roadName: flowData?.roadName || 'Unknown',
        confidence: flowData?.confidence || 0,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
