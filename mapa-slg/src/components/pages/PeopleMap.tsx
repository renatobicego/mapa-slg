"use client";
import React, { useCallback, useEffect, useState } from "react";

import { APIProvider, InfoWindow, Map } from "@vis.gl/react-google-maps";

import { Feature, Point } from "geojson";
import { InfoWindowContent } from "../layout/markers/InfoWindowContent";
import { CastlesGeojson, loadCastlesGeojson } from "@/utils/castle";
import { ClusteredMarkers } from "../layout/markers/ClusteredMarker";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const PeopleMap = () => {
  const [geojson, setGeojson] = useState<CastlesGeojson | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numClusters, setNumClusters] = useState(0);

  useEffect(() => {
    void loadCastlesGeojson().then((data: CastlesGeojson) => setGeojson(data));
  }, []);

  const [infowindowData, setInfowindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  const handleInfoWindowClose = useCallback(
    () => setInfowindowData(null),
    [setInfowindowData]
  );

  return (
    <APIProvider apiKey={API_KEY} version={"beta"} libraries={["marker"]}>
      <Map
        mapId={"a"}
        defaultCenter={{ lat: 20, lng: 20 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI
        onClick={() => setInfowindowData(null)}
        className={"custom-marker-clustering-map"}
      >
        {geojson && (
          <ClusteredMarkers
            geojson={geojson}
            setNumClusters={setNumClusters}
            setInfowindowData={setInfowindowData}
          />
        )}

        {infowindowData && (
          <InfoWindow
            onCloseClick={handleInfoWindowClose}
            anchor={infowindowData.anchor}
          >
            <InfoWindowContent features={infowindowData.features} />
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default PeopleMap;
