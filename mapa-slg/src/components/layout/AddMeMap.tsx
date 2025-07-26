"use client";

import { useState, useEffect, useRef, memo } from "react";
import LatLngAutocomplete from "../common/LatLngAutocomplete";

interface AddMeMapProps {
  lat: number;
  lng: number;
  handleLocationChange: (
    lat: number,
    lng: number
  ) => { lat: number; lng: number };
}

const AddMeMap = ({ lat, lng, handleLocationChange }: AddMeMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat,
    lng,
  });
  const ref = useRef<HTMLDivElement>(null);

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map) {
      const initializedMap = new google.maps.Map(ref.current, {
        center: { lat: lat ?? -32.8941303, lng: lng ?? -68.8419201 },
        zoom: 12,
        mapTypeControlOptions: {
          mapTypeIds: ["roadmap"],
        },
        streetViewControl: false,
        zoomControl: true,
        draggableCursor: "pointer",
        draggingCursor: "pointer",
        mapId: "google-maps-" + Math.random().toString(36).slice(2, 9),
      });
      setMap(initializedMap);
    }
  }, [map, lat, lng]);

  // Set up map click event
  useEffect(() => {
    if (map) {
      const clickListener = map.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });
          }
        }
      );

      // Cleanup listener on unmount
      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }
  }, [map]);

  const createMarker = async () => {
    // Create new marker at the new position
    // Remove existing marker if it exists
    if (marker) {
      marker.remove();
    }
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: markerPosition.lat, lng: markerPosition.lng },
      map: map,
      gmpDraggable: false,
    });
    handleLocationChange(markerPosition.lat, markerPosition.lng);
    setMarker(newMarker);
  };
  // Create or update marker
  useEffect(() => {
    if (map && markerPosition) {
      createMarker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, markerPosition]);

  return (
    <div className="flex flex-col gap-4 flex-1 h-[50vh]">
      <div
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
        }}
      />
      <LatLngAutocomplete
        handleLocationChange={(lat: number, lng: number) => {
          setMarkerPosition({ lat, lng });
          handleLocationChange(lat, lng);
        }}
        map={map}
      />
    </div>
  );
};

export default memo(AddMeMap);
