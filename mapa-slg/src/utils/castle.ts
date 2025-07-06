import { FeatureCollection, Point } from "geojson";

export type CastleFeatureProps = {
  name: string;
  wikipedia: string;
  wikidata: string;
};

// Function to generate random coordinates within a bounding box
function generateRandomCoordinates(
  centerLat: number,
  centerLng: number,
  radiusKm: number
) {
  // Convert radius from kilometers to degrees (rough approximation)
  const radiusDeg = radiusKm / 111; // 1 degree ≈ 111 km

  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusDeg;

  // Calculate new coordinates
  const lat = centerLat + distance * Math.cos(angle);
  const lng = centerLng + distance * Math.sin(angle);

  return [lng, lat]; // GeoJSON format: [longitude, latitude]
}

export type CastlesGeojson = FeatureCollection<Point, CastleFeatureProps>;

export async function loadCastlesGeojson(): Promise<CastlesGeojson> {
  const url = new URL("../data/users_500.json", import.meta.url);

  return await fetch(url).then((res) =>
    res.json().then((data) => {
      // Generate random coordinates for each feature
      data.features.forEach(
        (feature: { geometry: { coordinates: number[] } }) => {
          const [lng, lat] = generateRandomCoordinates(20, 20, 1000);
          feature.geometry.coordinates = [lng, lat];
        }
      );
      return data as CastlesGeojson;
    })
  );
}
