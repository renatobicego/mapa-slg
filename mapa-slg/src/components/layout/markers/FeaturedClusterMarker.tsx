"use client";

import React, { useCallback, useMemo } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Image } from "@heroui/react";
import { AvatarData } from "@/types/types";

type TreeClusterMarkerProps = {
  clusterId: number;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    clusterId: number
  ) => void;
  position: google.maps.LatLngLiteral;
  size: number;
  sizeAsText: string;
  avatars: AvatarData[];
  maxAvatarsToShow?: number;
  minMarkerSize?: number;
  sizeMultiplier?: number;
};

export const FeaturesClusterMarker = React.memo(
  ({
    position,
    size,
    sizeAsText,
    onMarkerClick,
    clusterId,
    avatars,
    maxAvatarsToShow = 3,
    minMarkerSize = 60,
    sizeMultiplier = 2,
  }: TreeClusterMarkerProps) => {
    const [markerRef, marker] = useAdvancedMarkerRef();

    // Memoize the marker size calculation
    const markerSize = useMemo(
      () => Math.floor(minMarkerSize + Math.sqrt(size) * sizeMultiplier),
      [size, minMarkerSize, sizeMultiplier]
    );

    // Memoize the avatars to display
    const displayAvatars = useMemo(
      () => avatars.slice(0, maxAvatarsToShow),
      [avatars, maxAvatarsToShow]
    );

    // Memoize the click handler
    const handleClick = useCallback(
      () => onMarkerClick && marker && onMarkerClick(marker, clusterId),
      [onMarkerClick, marker, clusterId]
    );

    // Memoize the render count function
    const renderCount = useCallback(
      () => (
        <p className="text-small text-foreground font-medium ms-2">
          +{sizeAsText}
        </p>
      ),
      [sizeAsText]
    );

    const indexBorderColor = useCallback((index: number) => {
      const colors = ["border-light-blue", "border-red", "border-yellow"];
      return colors[index];
    }, []);

    return (
      <AdvancedMarker
        ref={markerRef}
        position={position}
        zIndex={size}
        onClick={handleClick}
        style={{ width: markerSize, height: markerSize, overflow: "visible" }}
        anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      >
        <div className="flex relative items-center justify-center overflow-visible">
          {displayAvatars.map((avatar, index) => (
            <Image
              key={avatar.id}
              src={`${avatar.src ? avatar.src : "/default-avatar.webp"}`}
              alt={avatar.alt || `Avatar ${avatar.id}`}
              className={`rounded-full bg-white object-cover absolute border-2 ${indexBorderColor(
                index
              )} p-0.5 hover:scale-105 transition-all duration-200`}
              style={{
                left: `${(index * markerSize) / 2}px`,
                width: `${markerSize / 1.2}px`,
                height: `${markerSize / 1.2}px`,
              }}
              removeWrapper
            />
          ))}
          {renderCount()}
        </div>
      </AdvancedMarker>
    );
  }
);

FeaturesClusterMarker.displayName = "FeaturesClusterMarker";
