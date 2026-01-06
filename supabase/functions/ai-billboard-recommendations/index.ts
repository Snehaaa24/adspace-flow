import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Billboard {
  id: string;
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  width: number;
  height: number;
  price_per_month: number;
  daily_impressions: number | null;
  traffic_score: 'low' | 'medium' | 'high' | null;
  image_url: string | null;
  is_available: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { budget, preferred_traffic, location_preference } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch available billboards
    const { data: billboards, error: billboardsError } = await supabaseClient
      .from('billboards')
      .select('*')
      .eq('is_available', true);

    if (billboardsError) {
      console.error('Error fetching billboards:', billboardsError);
      throw new Error('Failed to fetch billboards');
    }

    if (!billboards || billboards.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          recommendations: [],
          message: 'No billboards available at the moment'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare billboard data for AI analysis
    const billboardSummary = billboards.map((b: Billboard) => ({
      id: b.id,
      title: b.title,
      location: b.location,
      size: `${b.width}m x ${b.height}m`,
      price: b.price_per_month,
      impressions: b.daily_impressions || 'Unknown',
      traffic: b.traffic_score || 'Unknown',
    }));

    // Build the AI prompt
    const systemPrompt = `You are an expert billboard advertising consultant for AdWiseManager. 
Your job is to recommend the best billboards based on the advertiser's requirements.

Consider these factors when making recommendations:
1. Budget fit - recommend billboards within or close to budget
2. Traffic score - match with advertiser's preference (high traffic for brand awareness, medium for balanced campaigns, low for cost-effective local reach)
3. Daily impressions - higher is generally better for reach
4. Billboard size - larger billboards have more impact but cost more
5. Location relevance - if specified

Always explain WHY each billboard is a good match.`;

    const userPrompt = `Here are the available billboards:
${JSON.stringify(billboardSummary, null, 2)}

Advertiser requirements:
- Budget: ₹${budget || 'No limit'} per month
- Preferred traffic level: ${preferred_traffic || 'Any'}
- Location preference: ${location_preference || 'No preference'}

Please recommend the top 3 billboards that best match these requirements. For each recommendation:
1. Explain why it's a good match
2. Highlight key benefits
3. Note any trade-offs

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "billboard_id": "id",
      "title": "billboard title",
      "match_score": 85,
      "reason": "Brief explanation of why this is recommended",
      "highlights": ["Key benefit 1", "Key benefit 2"],
      "trade_offs": ["Any potential downsides"]
    }
  ],
  "summary": "Brief overall summary of recommendations"
}`;

    console.log('Calling AI for recommendations...');

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI service error');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    console.log('AI response:', aiContent);

    // Parse JSON from AI response
    let recommendations;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                        aiContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiContent;
      recommendations = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback: return top billboards by impressions within budget
      const filtered = billboards
        .filter((b: Billboard) => !budget || b.price_per_month <= budget)
        .sort((a: Billboard, b: Billboard) => (b.daily_impressions || 0) - (a.daily_impressions || 0))
        .slice(0, 3);
      
      recommendations = {
        recommendations: filtered.map((b: Billboard) => ({
          billboard_id: b.id,
          title: b.title,
          match_score: 70,
          reason: `Good value billboard at ₹${b.price_per_month}/month with ${b.daily_impressions || 'unknown'} daily impressions`,
          highlights: [`${b.traffic_score || 'Unknown'} traffic area`, `${b.width}m x ${b.height}m size`],
          trade_offs: []
        })),
        summary: 'Recommendations based on best value within your budget'
      };
    }

    // Enrich recommendations with full billboard data
    const enrichedRecommendations = recommendations.recommendations?.map((rec: any) => {
      const billboard = billboards.find((b: Billboard) => b.id === rec.billboard_id);
      return {
        ...rec,
        billboard: billboard || null
      };
    }) || [];

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: enrichedRecommendations,
        summary: recommendations.summary || ''
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI recommendations:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
