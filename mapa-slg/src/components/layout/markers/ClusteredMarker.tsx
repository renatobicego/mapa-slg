import React, { useCallback } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { FeatureMarker } from "./FeaturedMarker";
import { FeaturesClusterMarker } from "./FeaturedClusterMarker";
import { useSupercluster } from "@/hooks/useSupercluster";
import { IUserProfile } from "@/types/types";

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setInfowindowData: (
    data: {
      isLeaf: true;
      data: IUserProfile;
    } | null
  ) => void;
  onOpen: () => void;
  increaseMapZoom: (
    center?: google.maps.LatLng | google.maps.LatLngLiteral | null
  ) => void;
};

const superclusterOptions: Supercluster.Options<
  GeoJsonProperties,
  ClusterProperties
> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
};

export const ClusteredMarkers = ({
  geojson,
  setInfowindowData,
  onOpen,
  increaseMapZoom,
}: ClusteredMarkersProps) => {
  const { clusters, getClusterAvatars } = useSupercluster(
    geojson,
    superclusterOptions
  );

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) => {
      increaseMapZoom(marker.position);
    },
    [increaseMapZoom]
  );

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find(
        (feat) => feat.id === featureId
      ) as Feature<Point>;
      const user = feature.properties as IUserProfile;

      setInfowindowData({ isLeaf: true, data: user });
      onOpen();
    },
    [clusters, onOpen, setInfowindowData]
  );

  return (
    <>
      {clusters.map((feature, index) => {
        const [lng, lat] = feature.geometry.coordinates;

        const clusterProperties = feature.properties as ClusterProperties;
        const leafProperties = feature as Feature<Point>;
        const isCluster: boolean = clusterProperties.cluster;
        return isCluster ? (
          <FeaturesClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            avatars={getClusterAvatars(clusterProperties.cluster_id, 3).map(
              (leaf) => ({
                id: leaf.id as string,
                src: leaf.properties?.profileImage,
              })
            )}
            index={index}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            onMarkerClick={handleClusterClick}
          />
        ) : (
          <FeatureMarker
            key={feature.id}
            featureId={feature.id as string}
            position={{ lat, lng }}
            index={index}
            avatar={{
              id: leafProperties.id as string,
              src: leafProperties.properties?.profileImage,
            }}
            onMarkerClick={handleMarkerClick}
          />
        );
      })}
    </>
  );
};
