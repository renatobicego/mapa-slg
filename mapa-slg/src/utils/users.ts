import { IUserProfile } from "@/types/types";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";

export const mapUsersToGeojson = (
  users: IUserProfile[]
): FeatureCollection<Point, GeoJsonProperties> => {
  return {
    type: "FeatureCollection",
    features: users.map((user) => ({
      type: "Feature",
      id: user._id,
      properties: user,
      geometry: user.location,
    })),
  };
};
