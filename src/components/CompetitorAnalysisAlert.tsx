import React, { useMemo } from "react";
import { AlertTriangle, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CompetitorAnalysisProps {
  currentBillboardId: string;
  category: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const CompetitorAnalysisAlert: React.FC<CompetitorAnalysisProps> = ({
  currentBillboardId,
  category,
  latitude,
  longitude,
  radiusKm = 5,
}) => {
  const { data: nearbyBillboards, isLoading } = useQuery({
    queryKey: ["competitor-billboards", category, currentBillboardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billboards")
        .select("id, title, latitude, longitude, location, price_per_month, traffic_score, category")
        .neq("id", currentBillboardId)
        .eq("is_available", true)
        .eq("category", category);

      if (error) throw error;
      return data || [];
    },
    enabled: !!latitude && !!longitude,
  });

  const competitorsInArea = useMemo(() => {
    if (!nearbyBillboards) return [];

    return nearbyBillboards
      .filter((b) => b.latitude != null && b.longitude != null)
      .map((billboard) => ({
        ...billboard,
        distance: calculateDistance(
          latitude,
          longitude,
          Number(billboard.latitude),
          Number(billboard.longitude)
        ),
      }))
      .filter((b) => b.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }, [nearbyBillboards, latitude, longitude, radiusKm]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg border border-border bg-muted/50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Analyzing nearby competitors…</span>
      </div>
    );
  }

  const hasCompetitors = competitorsInArea.length > 0;

  return (
    <div className="space-y-2">
      {hasCompetitors ? (
        <Alert className="border-orange-400/60 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-600/40">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <AlertTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
            Category Competition Alert
            <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-300 text-xs">
              {competitorsInArea.length} in "{category}"
            </Badge>
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-400">
            <p className="mb-2">
              ⚠️ There {competitorsInArea.length === 1 ? "is" : "are"}{" "}
              <strong>{competitorsInArea.length}</strong> other{" "}
              <strong>{category}</strong> category billboard
              {competitorsInArea.length > 1 ? "s" : ""} within a{" "}
              <strong>{radiusKm} km</strong> radius. Advertising in a saturated category zone may reduce your campaign's visibility and impact.
            </p>
            <ul className="space-y-1.5">
              {competitorsInArea.slice(0, 3).map((comp) => (
                <li key={comp.id} className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium">{comp.title}</span>
                  <span className="text-orange-600/70 dark:text-orange-400/70">
                    — {category} • {comp.distance.toFixed(1)} km away
                  </span>
                </li>
              ))}
              {competitorsInArea.length > 3 && (
                <li className="text-sm text-orange-600/80 dark:text-orange-400/80 pl-5">
                  + {competitorsInArea.length - 3} more {category} billboards nearby
                </li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-emerald-400/60 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600/40">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-emerald-800 dark:text-emerald-300">Prime Location — No "{category}" Competitors</AlertTitle>
          <AlertDescription className="text-emerald-700 dark:text-emerald-400">
            No other <strong>{category}</strong> billboards found within a {radiusKm} km radius. This is an uncrowded zone for your category — ideal for maximum campaign impact.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CompetitorAnalysisAlert;
