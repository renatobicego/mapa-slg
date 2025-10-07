"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Map, MapEvent } from "@vis.gl/react-google-maps";

import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import { InfoWindowContent } from "../layout/markers/InfoWindowContent";
import { ClusteredMarkers } from "../layout/markers/ClusteredMarker";
import { IUserProfile } from "@/types/types";
import { getUsersService } from "@/api/users";
import { mapUsersToGeojson } from "@/utils/users";
import { useDisclosure } from "@heroui/react";
import AddMeMapModal from "../layout/AddMeMapModal";
import { useHeroStore } from "@/stores/useHeroStore";
import { Edit, PlusIcon } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import FilterButton from "../layout/FilterButton";
// import { loadCastlesGeojson } from "@/utils/castle";

const AddMeButton = ({
  prevDataExists,
  onClick,
}: {
  prevDataExists: boolean;
  onClick?: () => void;
}) => {
  const { isVisible: isHeroSectionShowed } = useHeroStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isHeroSectionShowed) {
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }
  }, [isHeroSectionShowed]);

  const buttonVariants: Variants = {
    expanded: {
      borderRadius: "12px",
      padding: "12px 20px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    collapsed: {
      borderRadius: "50px",
      padding: "12px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const textVariants: Variants = {
    visible: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: prevDataExists ? 0 : 90,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const shouldShowExpanded = isOpen || isHovered;

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.button
      className="font-semibold bg-black text-white cursor-pointer w-auto text-small lg:text-base 2xl:text-lg flex gap-1 lg:gap-1.5 2xl:gap-2 items-center "
      variants={buttonVariants}
      animate={shouldShowExpanded ? "expanded" : "collapsed"}
      whileHover="hover"
      whileTap="tap"
      initial="expanded"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <motion.div variants={iconVariants} className="flex items-center">
        {prevDataExists && isSignedIn ? (
          <Edit size={20} className="lg:size-6 2xl:size-7" />
        ) : (
          <PlusIcon size={20} className="lg:size-6 2xl:size-7" />
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {shouldShowExpanded && (
          <motion.span
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden whitespace-nowrap"
          >
            {prevDataExists && isSignedIn ? "Editar Mi Pin" : "Sumarme"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const PeopleMap = () => {
  const [users, setUsers] = useState<FeatureCollection<
    Point,
    GeoJsonProperties
  > | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<FeatureCollection<
    Point,
    GeoJsonProperties
  > | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [prevDataExists, setPrevDataExists] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;
    void getUsersService()
      .then((data: { users: IUserProfile[]; totalUsers: number }) =>
        setUsers(mapUsersToGeojson(data.users))
      )
      .finally(() => setShouldFetch(false));
  }, [shouldFetch]);

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
    <>
      <Map
        mapId={"a"}
        defaultCenter={{ lat: -36, lng: -64 }}
        defaultZoom={5}
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
            geojson={filteredUsers ?? users}
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
      <menu className="absolute bottom-5 right-5 lg:bottom-8 lg:right-8 flex gap-2 items-center">
        <FilterButton users={users} setFilteredUsers={setFilteredUsers} />
        <AddMeMapModal
          button={<AddMeButton prevDataExists={prevDataExists} />}
          onPreviousData={setPrevDataExists}
          prevDataExists={prevDataExists}
          setShouldFetch={setShouldFetch}
        />
      </menu>
    </>
  );
};

export default PeopleMap;
