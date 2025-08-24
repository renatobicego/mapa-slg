"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
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
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });
  const ref = useRef<HTMLDivElement>(null);

  const id = useMemo(() => Math.random().toString(36).slice(2, 9), []);

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map) {
      const initializedMap = new google.maps.Map(ref.current, {
        center: { lat: lat ?? -32.8941303, lng: lng ?? -68.8419201 },
        zoom: 14,
        disableDefaultUI: true, // disable default controls
        zoomControl: false, // optionally enable zoom
        streetViewControl: false,
        mapTypeControl: false,
        mapId: "google-maps-" + id,
      });
      setMap(initializedMap);
    }
  }, [map, lat, lng, id]);

  // Map click listener
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

      return () => {
        google.maps.event.removeListener(clickListener);
      };
    }
  }, [map]);

  const createMarker = () => {
    if (marker) marker.remove();

    if (!markerPosition.lat || !markerPosition.lng) return;
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: markerPosition,
      map: map!,
      gmpDraggable: false,
    });
    handleLocationChange(markerPosition.lat, markerPosition.lng);
    setMarker(newMarker);
  };

  useEffect(() => {
    if (map && markerPosition && markerPosition.lat && markerPosition.lng) {
      createMarker();
      map.setCenter(markerPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, markerPosition]);

  // Get user location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "La geolocalización no está disponible en tu navegador. Por favor, utiliza un navegador más reciente."
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition({ lat: latitude, lng: longitude });
        handleLocationChange(latitude, longitude);
        if (map) map.setCenter({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error(error);
        alert("Error al obtener tu ubicación.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col gap-4 flex-1 h-[80vh] sm:h-[50vh] relative w-full">
      <LatLngAutocomplete
        handleLocationChange={(lat: number, lng: number) => {
          setMarkerPosition({ lat, lng });
          handleLocationChange(lat, lng);
        }}
        map={map}
        className="absolute top-0 left-0 z-10 w-auto sm:w-1/2 bg-white m-2 p-3 rounded-2xl"
      />
      <div ref={ref} className="h-[60vh] w-full rounded-2xl" />

      {/* Floating button for geolocation */}
      <button
        onClick={handleGetCurrentLocation}
        className="absolute top-36 left-2 bg-white shadow-md rounded-full text-small p-3 hover:bg-gray-100 transition font-semibold"
        aria-label="Get current location"
      >
        📍 Ubicación Actual
      </button>
    </div>
  );
};

export default memo(AddMeMap);
