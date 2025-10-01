"use client";

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import LatLngAutocomplete from "../common/LatLngAutocomplete";

interface AddMeMapProps {
  lat: number;
  lng: number;
  handleLocationChange: (
    lat: number,
    lng: number
  ) => { lat: number; lng: number };
  defaultCoords?: { lat: number; lng: number } | null;
  image?: string;
  index: number;
}

const AddMeMap = ({
  lat,
  lng,
  handleLocationChange,
  defaultCoords,
  image,
  index,
}: AddMeMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [markerPosition, setMarkerPosition] = useState({ lat, lng });
  const ref = useRef<HTMLDivElement>(null);

  const id = useMemo(() => Math.random().toString(36).slice(2, 9), []);

  // Initialize the map
  useEffect(() => {
    if (!ref.current || map || !window.google?.maps) return;
    const initializedMap = new google.maps.Map(ref.current, {
      center: {
        lat: defaultCoords ? defaultCoords.lat : -32.8941303,
        lng: defaultCoords ? defaultCoords.lng : -68.8419201,
      },
      zoom: 14,
      disableDefaultUI: true, // disable default controls
      zoomControl: false, // optionally enable zoom
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: "greedy",
      clickableIcons: false,
      draggableCursor: "pointer",
      mapId: "google-maps-" + id,
    });
    setMap(initializedMap);
  }, [map, lat, lng, id, defaultCoords]);

  const getRandomIcon = useCallback(() => {
    const icons = ["/heart.png", "/book.png", "/pen.png"];
    return icons[index % icons.length];
  }, [index]);

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
    // Create custom marker content with avatar styling
    const markerContent = document.createElement("div");
    markerContent.className = "custom-marker";
    markerContent.innerHTML = `
      <div class="marker-container">
         <img
          src="${image ? image : getRandomIcon()}"
          alt="User Avatar"
          class="marker-avatar"
        />
        <div class="marker-tip"></div>
      </div>
      <style>
        .marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .custom-marker:hover {
          transform: scale(1.05);
        }
        .marker-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #3b82f6;
          padding: 2px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 2;
        }
        .marker-tip {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 16px solid #3b82f6;
          position: relative;
          top: -2px;
          z-index: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        .marker-tip::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 14px solid white;
          left: -8px;
          top: -16px;
        }
      </style>
    `;
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      position: markerPosition,
      map: map!,
      content: markerContent,
      gmpDraggable: false,
    });
    handleLocationChange(markerPosition.lat, markerPosition.lng);
    setMarker(newMarker);
  };

  useEffect(() => {
    if (map && markerPosition && markerPosition.lat && markerPosition.lng) {
      createMarker();
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
        className="absolute top-0 left-0 z-10 w-auto  bg-white m-2 p-3 rounded-2xl"
      />
      <div ref={ref} className="h-[60vh] w-full rounded-2xl" />

      {/* Floating button for geolocation */}
      <button
        onClick={handleGetCurrentLocation}
        type="button"
        className="absolute top-36 md:top-32 left-2 bg-white shadow-md rounded-full text-small p-3 hover:bg-gray-100 transition font-semibold"
        aria-label="Get current location"
      >
        📍 Ubicación Actual
      </button>
    </div>
  );
};

export default memo(AddMeMap);
