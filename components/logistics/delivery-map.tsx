"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface DeliveryMapProps {
  deliveries: any[];
  selectedDelivery: any;
}

export function DeliveryMap({ deliveries, selectedDelivery }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current && !googleMapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 9.0820, lng: 8.6753 }, // Nigeria center
          zoom: 6,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        googleMapRef.current = map;
      }
      updateMarkers();
    });
  }, []);

  useEffect(() => {
    updateMarkers();
  }, [deliveries, selectedDelivery]);

  function updateMarkers() {
    if (!googleMapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    deliveries.forEach((delivery) => {
      const isSelected = selectedDelivery?.id === delivery.id;

      // Pickup marker
      const pickupMarker = new google.maps.Marker({
        position: delivery.pickup_location,
        map: googleMapRef.current,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new google.maps.Size(isSelected ? 40 : 30, isSelected ? 40 : 30),
        },
        title: "Pickup Location",
      });

      // Delivery marker
      const deliveryMarker = new google.maps.Marker({
        position: delivery.delivery_location,
        map: googleMapRef.current,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new google.maps.Size(isSelected ? 40 : 30, isSelected ? 40 : 30),
        },
        title: "Delivery Location",
      });

      // Draw route line
      const route = new google.maps.Polyline({
        path: [delivery.pickup_location, delivery.delivery_location],
        geodesic: true,
        strokeColor: isSelected ? "#2563EB" : "#94A3B8",
        strokeOpacity: 0.8,
        strokeWeight: isSelected ? 3 : 2,
      });
      route.setMap(googleMapRef.current);

      markersRef.current.push(pickupMarker, deliveryMarker);
      markersRef.current.push(route as any);
    });

    // Center map on selected delivery
    if (selectedDelivery) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(selectedDelivery.pickup_location);
      bounds.extend(selectedDelivery.delivery_location);
      googleMapRef.current.fitBounds(bounds);
    }
  }

  return <div ref={mapRef} className="w-full h-full" />;
}