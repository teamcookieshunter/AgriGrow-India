
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression, Map } from 'leaflet';
import L from 'leaflet';

interface MapDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLocationSelect: (address: string) => void;
}

// Fix for default Leaflet icon path issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export default function MapDialog({ isOpen, onOpenChange, onLocationSelect }: MapDialogProps) {
  const [position, setPosition] = useState<LatLngExpression>([20.5937, 78.9629]); // Centered on India
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([20.5937, 78.9629]);
  const markerRef = useRef<L.Marker>(null);
  const mapRef = useRef<Map>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setMarkerPosition([lat, lng]);
        }
      },
    }),
    [],
  );


  const handleConfirm = async () => {
    // In a real implementation, you would use a geocoding service to get the address from lat/lng.
    // For this placeholder, we'll return a sample address and coordinates.
    try {
      // Using a free reverse geocoding service (Nominatim)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerPosition[0]}&lon=${markerPosition[1]}`);
      const data = await response.json();
      const address = data.display_name || `Lat: ${markerPosition[0].toFixed(4)}, Lng: ${markerPosition[1].toFixed(4)}`;
      onLocationSelect(address);
    } catch (error) {
        console.error("Failed to fetch address:", error);
        // Fallback to coordinates if API fails
        onLocationSelect(`Lat: ${markerPosition[0].toFixed(4)}, Lng: ${markerPosition[1].toFixed(4)}`);
    }
    onOpenChange(false);
  };
  
  const centerOnCurrentLocation = () => {
    mapRef.current?.locate().on("locationfound", function (e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      mapRef.current?.flyTo(e.latlng, 13);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Pinpoint Your Location</DialogTitle>
          <DialogDescription>
            Drag the marker to your exact farm location or use the button to find your current location.
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
            <div className="h-[400px] w-full bg-muted rounded-md z-0">
             <MapContainer
                center={position}
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full rounded-md"
                ref={mapRef}
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={markerPosition}
                    ref={markerRef}>
                    <Popup minWidth={90}>
                        <span>Drag me to your farm!</span>
                    </Popup>
                </Marker>
            </MapContainer>
            </div>
        )}
        <DialogFooter className="sm:justify-between gap-2">
            <Button variant="outline" onClick={centerOnCurrentLocation}>
                Use My Current Location
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm Location</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
