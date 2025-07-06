import React, { useCallback, useEffect } from "react";
import Supercluster, { ClusterProperties } from "supercluster";
import { Feature, FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { FeatureMarker } from "./FeaturedMarker";
import { FeaturesClusterMarker } from "./FeaturedClusterMarker";
import { useSupercluster } from "@/hooks/useSupercluster";

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setNumClusters: (n: number) => void;
  setInfowindowData: (
    data: {
      anchor: google.maps.marker.AdvancedMarkerElement;
      features: Feature<Point>[];
    } | null
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
  setNumClusters,
  setInfowindowData,
}: ClusteredMarkersProps) => {
  const { clusters, getLeaves, getClusterAvatars } = useSupercluster(
    geojson,
    superclusterOptions
  );

  useEffect(() => {
    setNumClusters(clusters.length);
  }, [setNumClusters, clusters.length]);

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      const leaves = getLeaves(clusterId);

      setInfowindowData({ anchor: marker, features: leaves });
    },
    [getLeaves, setInfowindowData]
  );

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find(
        (feat) => feat.id === featureId
      ) as Feature<Point>;

      setInfowindowData({ anchor: marker, features: [feature] });
    },
    [clusters, setInfowindowData]
  );

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;

        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProperties.cluster;
        return isCluster ? (
          <FeaturesClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            avatars={getClusterAvatars(clusterProperties.cluster_id, 3).map(
              (leaf) => ({
                id: leaf.id as string,
                src: leaf.properties?.src as string,
              })
            )}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            onMarkerClick={handleClusterClick}
          />
        ) : (
          <FeatureMarker
            key={feature.id}
            featureId={feature.id as string}
            position={{ lat, lng }}
            onMarkerClick={handleMarkerClick}
          />
        );
      })}
    </>
  );
};
