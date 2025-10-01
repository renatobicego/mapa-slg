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
  index: number;
};

export const FeatureMarker = ({
  position,
  featureId,
  onMarkerClick,
  avatar,
  index,
}: TreeMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId]
  );

  const getRandomIcon = useCallback(() => {
    const icons = ["/heart.png", "/book.png", "/pen.png"];
    return icons[index % icons.length];
  }, [index]);

  const indexBorderColor = useCallback(() => {
    const colors = ["border-light-blue", "border-red", "border-yellow"];
    return colors[index % colors.length];
  }, [index]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      className="select-none"
    >
      <Image
        key={avatar.id}
        src={`${avatar.src ? avatar.src : getRandomIcon()}`}
        alt={avatar.alt || `Avatar ${avatar.id}`}
        className={`rounded-full  object-cover h-14 w-14 border-2 p-0.5 hover:scale-105 transition-all duration-200 bg-white select-none ${indexBorderColor()}`}
        removeWrapper
      />
    </AdvancedMarker>
  );
};
