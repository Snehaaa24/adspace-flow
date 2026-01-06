import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

// Fix Leaflet default icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});


interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// Component to handle map click events
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map when coordinates change externally
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  
  return null;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  const handleLatChange = (value: string) => {
    const lat = parseFloat(value);
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      handleLocationChange(lat, position[1]);
    }
  };

  const handleLngChange = (value: string) => {
    const lng = parseFloat(value);
    if (!isNaN(lng) && lng >= -180 && lng <= 180) {
      handleLocationChange(position[0], lng);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Select Location on Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md overflow-hidden border">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '250px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationChange={handleLocationChange} />
            <MapRecenter lat={position[0]} lng={position[1]} />
            <Marker position={position} />
          </MapContainer>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Click on the map to set the billboard location, or enter coordinates manually.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={position[0]}
              onChange={(e) => handleLatChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={position[1]}
              onChange={(e) => handleLngChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
