import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { MapPin } from "lucide-react";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const LatLngAutocomplete = ({
  handleLocationChange,
  map,
  className,
}: {
  handleLocationChange: (
    lat: number,
    lng: number,
    description?: string
  ) => void;
  map: google.maps.Map | null;
  className?: string;
}) => {
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      options: {
        types: ["geocode"],
        input: "",
      },
    });

  const handleSelectPlace = (placeId: string) => {
    if (map && placeId) {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails({ placeId: placeId }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const location = result.geometry?.location;
          if (location) {
            const lat = location.lat();
            const lng = location.lng();
            handleLocationChange(lat, lng, result.formatted_address);
            map.setCenter({ lat, lng });
          }
        }
      });
    }
  };

  return (
    <Autocomplete
      label="Ubicación / Ciudad"
      placeholder="Ingresa una ubicación, calle o ciudad"
      autoComplete="hidden"
      labelPlacement="outside"
      listboxProps={{
        emptyContent: "No se encontraron resultados",
      }}
      radius="lg"
      lang="es"
      description="Podés seleccionar desde los resultados o cargar tu ubicación en el mapa"
      onValueChange={(value) => getPlacePredictions({ input: value })}
      onSelectionChange={(key) => handleSelectPlace(key as string)}
      isLoading={isPlacePredictionsLoading}
      className={className}
    >
      {placePredictions.map(
        (place: { place_id: string; description: string }) => (
          <AutocompleteItem
            classNames={{
              title: "text-[0.8125rem]",
            }}
            startContent={<MapPin />}
            key={place.place_id}
            textValue={place.description}
          >
            {place.description}
          </AutocompleteItem>
        )
      )}
    </Autocomplete>
  );
};

export default LatLngAutocomplete;
