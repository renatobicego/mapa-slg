"use client";

import React, { useCallback, useMemo } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Avatar, AvatarGroup } from "@heroui/react";

type AvatarData = {
  id: string;
  src: string;
  alt?: string;
};

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
    minMarkerSize = 48,
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

    return (
      <AdvancedMarker
        ref={markerRef}
        position={position}
        zIndex={size}
        onClick={handleClick}
        style={{ width: markerSize, height: markerSize }}
        anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      >
        <AvatarGroup
          isBordered
          max={maxAvatarsToShow}
          renderCount={renderCount}
          total={size}
        >
          {displayAvatars.map((avatar) => (
            <Avatar
              key={avatar.id}
              src={avatar.src}
              alt={avatar.alt || `Avatar ${avatar.id}`}
            />
          ))}
        </AvatarGroup>
      </AdvancedMarker>
    );
  }
);

FeaturesClusterMarker.displayName = "FeaturesClusterMarker";
