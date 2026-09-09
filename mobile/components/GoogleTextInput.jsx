import { View } from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  console.log("GOOGLE API:", GOOGLE_API_KEY);

export default function GoogleTextInput({
  onPlaceSelect,
}) {
  return (
    <View
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        zIndex: 100,
      }}
    >
      <GooglePlacesAutocomplete
        placeholder="Where to?"
        fetchDetails={true}
        debounce={200}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"

        styles={{
          container: {
            flex: 0,
            paddingHorizontal: 20,
          },

          textInput: {
            height: 55,
            borderRadius: 12,
            fontSize: 16,
            borderWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "white",
          },

          listView: {
            backgroundColor: "white",
            borderRadius: 12,
          },
        }}

        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}

        onPress={(data, details = null) => {
          const location =
            details?.geometry?.location;

          onPlaceSelect({
            latitude: location.lat,
            longitude: location.lng,
            address: data.description,
          });
        }}
      />
    </View>
  );
}