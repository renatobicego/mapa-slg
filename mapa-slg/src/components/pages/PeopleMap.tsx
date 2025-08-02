"use client";
import React, { useCallback, useEffect, useState } from "react";

import { APIProvider, Map, MapEvent } from "@vis.gl/react-google-maps";

import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { InfoWindowContent } from "../layout/markers/InfoWindowContent";
import { ClusteredMarkers } from "../layout/markers/ClusteredMarker";
import { IUserProfile } from "@/types/types";
import { getUsersService } from "@/api/users";
import { mapUsersToGeojson } from "@/utils/users";
import { useDisclosure } from "@heroui/react";
// import { loadCastlesGeojson } from "@/utils/castle";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const PeopleMap = () => {
  const [users, setUsers] = useState<FeatureCollection<
    Point,
    GeoJsonProperties
  > | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  useEffect(() => {
    void getUsersService().then(
      (data: { users: IUserProfile[]; totalUsers: number }) =>
        setUsers(mapUsersToGeojson(data.users))
    );
    // void loadCastlesGeojson().then((geojson) => {
    //   setUsers(geojson);
    // });
  }, []);

  const [infowindowData, setInfowindowData] = useState<{
    isLeaf: true;
    data: IUserProfile;
  } | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const increaseMapZoom = useCallback(
    (center?: google.maps.LatLng | google.maps.LatLngLiteral | null) => {
      if (mapRef.current) {
        const currentZoom = mapRef.current.getZoom() || 3;
        mapRef.current.setZoom(currentZoom + 2);
        if (center) {
          mapRef.current.setCenter(center);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapRef.current]
  );

  return (
    <APIProvider
      apiKey={API_KEY}
      version={"beta"}
      libraries={["marker", "places"]}
    >
      <Map
        mapId={"a"}
        defaultCenter={{ lat: 20, lng: 20 }}
        defaultZoom={3}
        minZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI
        onIdle={(event: MapEvent) => {
          if (!mapRef.current) {
            mapRef.current = event.map;
          }
        }}
        onClick={() => setInfowindowData(null)}
        className={"custom-marker-clustering-map"}
      >
        {users && (
          <ClusteredMarkers
            geojson={users}
            setInfowindowData={setInfowindowData}
            onOpen={onOpen}
            increaseMapZoom={increaseMapZoom}
          />
        )}

        <InfoWindowContent
          data={infowindowData}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      </Map>
    </APIProvider>
  );
};

export default PeopleMap;
