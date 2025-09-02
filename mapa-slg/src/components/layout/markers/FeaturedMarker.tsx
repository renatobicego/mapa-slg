import React, { useCallback } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { AvatarData } from "@/types/types";
import { Image } from "@heroui/react";

type TreeMarkerProps = {
  position: google.maps.LatLngLiteral;
  featureId: string;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    featureId: string
  ) => void;
  avatar: AvatarData;
};

export const FeatureMarker = ({
  position,
  featureId,
  onMarkerClick,
  avatar,
}: TreeMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId]
  );

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <Image
        key={avatar.id}
        src={`${avatar.src ? avatar.src : "/default-avatar.webp"}`}
        alt={avatar.alt || `Avatar ${avatar.id}`}
        className="rounded-full  object-cover h-14 w-14 border-2 border-white p-0.5 hover:scale-105 transition-all duration-200 bg-white"
        removeWrapper
      />
    </AdvancedMarker>
  );
};
