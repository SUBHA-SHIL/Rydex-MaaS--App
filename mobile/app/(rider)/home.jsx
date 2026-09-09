import { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";

import {
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";

import * as Location from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  router,
} from "expo-router";

import axios from "axios";

import socket from "../../hooks/useSocket";

import useAuthStore from "../../store/authStore";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

const { width } =
  Dimensions.get("window");

export default function Home() {

  const [location, setLocation] =
    useState(null);

  const [pickup, setPickup] =
    useState(null);

  const [destination, setDestination] =
    useState(null);

  const [driverLocation, setDriverLocation] =
    useState(null);

  const [recentRides, setRecentRides] =
    useState([]);

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const pickupRef =
    useRef(null);

  const destinationRef =
    useRef(null);

  const user =
    useAuthStore(
      (state) => state.user
    );

  useEffect(() => {

    getLocation();

    fetchRecentRides();

  }, []);

  useEffect(() => {

    socket.on(
      "driverLocation",
      (data) => {

        setDriverLocation({
          latitude:
            data.latitude,

          longitude:
            data.longitude,
        });
      }
    );

    return () => {

      socket.off(
        "driverLocation"
      );
    };

  }, []);

  const getLocation =
    async () => {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {

          alert(
            "Location permission denied"
          );

          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({});

        setLocation(
          currentLocation.coords
        );

        setPickup({
          latitude:
            currentLocation.coords.latitude,

          longitude:
            currentLocation.coords.longitude,

          address:
            "Current Location",
        });

      } catch (error) {

        console.log(error);
      }
    };

  const fetchRecentRides =
    async () => {

      try {

        const storedUser =
          JSON.parse(
            await AsyncStorage.getItem("user")
          );

        const response =
          await axios.get(
            `${API_URL}/api/history/${storedUser.id}`
          );

        const sortedRides =
          response.data
            .sort(
              (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
            )
            .slice(0, 3);

        setRecentRides(
          sortedRides
        );

      } catch (error) {

        console.log(error);
      }
    };

  const animateIn = () => {

    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderRide =
    ({ item: ride }) => (

      <View style={styles.rideCard}>

        <View style={styles.locationRow}>

          <View style={styles.dot} />

          <Text
            style={styles.locationText}
            numberOfLines={1}
          >
            {ride.pickup_address}
          </Text>

        </View>

        <View style={styles.line} />

        <View style={styles.locationRow}>

          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  "#16a34a",
              },
            ]}
          />

          <Text
            style={styles.locationText}
            numberOfLines={1}
          >
            {ride.drop_address}
          </Text>

        </View>

        <View style={styles.rideBottom}>

          <Text style={styles.price}>
            ₹{ride.fare}
          </Text>

          <Text style={styles.status}>
            {ride.status}
          </Text>

        </View>

      </View>
    );

  if (!location) {

    return (

      <View style={styles.center}>

        <Text>
          Getting location...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View>

            <Text style={styles.smallText}>
              Welcome Back
            </Text>

            <Text style={styles.welcome}>
              {user?.name} 👋
            </Text>

          </View>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/(rider)/profile"
              )
            }
          >

            <Image
              source={require("../../assets/icons/profile.png")}
              style={styles.profileImage}
            />

          </TouchableOpacity>

        </View>

        {/* SEARCH CARD */}

        <View style={styles.searchCard}>

          <Text style={styles.searchTitle}>
            Book Your Ride
          </Text>

          {/* PICKUP */}

          <View
            style={{
              zIndex: 9999,
              elevation: 9999,
              marginBottom: 15,
            }}
          >

            <GooglePlacesAutocomplete

              ref={pickupRef}

              placeholder="Pickup location"

              fetchDetails={true}

              keyboardShouldPersistTaps="handled"

              enablePoweredByContainer={false}

              keepResultsAfterBlur={true}

              debounce={300}

              minLength={2}

              nearbyPlacesAPI="GooglePlacesSearch"

              onPress={(data, details = null) => {

                if (details) {

                  setPickup({
                    latitude:
                      details.geometry.location.lat,

                    longitude:
                      details.geometry.location.lng,

                    address:
                      data.description,
                  });
                }
              }}

              query={{
                key: GOOGLE_API_KEY,
                language: "en",
              }}

              styles={{

                container: {
                  flex: 0,
                },

                textInputContainer: {
                  backgroundColor: "transparent",
                },

                textInput: {

                  height: 60,

                  borderRadius: 18,

                  backgroundColor: "#f5f5f5",

                  paddingHorizontal: 20,

                  fontSize: 16,

                  color: "black",
                },

                listView: {

                  backgroundColor:
                    "white",

                  borderRadius: 18,

                  marginTop: 8,

                  elevation: 10,
                },
              }}
            />

          </View>

          {/* DESTINATION */}

          <View
            style={{
              zIndex: 8888,
              elevation: 8888,
            }}
          >

            <GooglePlacesAutocomplete

              ref={destinationRef}

              placeholder="Where to go?"

              fetchDetails={true}

              keyboardShouldPersistTaps="handled"

              enablePoweredByContainer={false}

              keepResultsAfterBlur={true}

              debounce={300}

              minLength={2}

              nearbyPlacesAPI="GooglePlacesSearch"

              onPress={(data, details = null) => {

                if (details) {

                  setDestination({
                    latitude:
                      details.geometry.location.lat,

                    longitude:
                      details.geometry.location.lng,

                    address:
                      data.description,
                  });
                }
              }}

              query={{
                key: GOOGLE_API_KEY,
                language: "en",
              }}

              styles={{

                container: {
                  flex: 0,
                },

                textInputContainer: {
                  backgroundColor: "transparent",
                },

                textInput: {

                  height: 60,

                  borderRadius: 18,

                  backgroundColor: "#f5f5f5",

                  paddingHorizontal: 20,

                  fontSize: 16,

                  color: "black",
                },

                listView: {

                  backgroundColor:
                    "white",

                  borderRadius: 18,

                  marginTop: 8,

                  elevation: 10,
                },
              }}
            />

          </View>

          {/* BUTTON */}

          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    scaleAnim,
                },
              ],
            }}
          >

            <Pressable

              style={styles.findButton}

              onPress={() => {

                if (!pickup) {

                  alert(
                    "Please select pickup location"
                  );

                  return;
                }

                if (!destination) {

                  alert(
                    "Please select destination"
                  );

                  return;
                }

                router.push({

                  pathname:
                    "/(rider)/dispatch",

                  params: {

                    pickup:
                      JSON.stringify(
                        pickup
                      ),

                    drop:
                      JSON.stringify(
                        destination
                      ),
                  },
                });
              }}

              onPressIn={animateIn}

              onPressOut={animateOut}
            >

              <Text style={styles.findText}>
                Find Available Drivers
              </Text>

            </Pressable>

          </Animated.View>

        </View>

        {/* MAP */}

        <View style={styles.mapContainer}>

          <MapView

            style={styles.map}

            showsUserLocation

            region={{

              latitude:
                pickup?.latitude ||
                location.latitude,

              longitude:
                pickup?.longitude ||
                location.longitude,

              latitudeDelta: 0.05,

              longitudeDelta: 0.05,
            }}
          >

            {pickup?.latitude && (

              <Marker
                coordinate={{
                  latitude:
                    pickup.latitude,

                  longitude:
                    pickup.longitude,
                }}
                title="Pickup"
              />
            )}

            {destination?.latitude && (

              <Marker
                coordinate={{
                  latitude:
                    destination.latitude,

                  longitude:
                    destination.longitude,
                }}
                title="Destination"
              />
            )}

            {driverLocation && (

              <Marker
                coordinate={{
                  latitude:
                    driverLocation.latitude,

                  longitude:
                    driverLocation.longitude,
                }}
                title="Driver"
                pinColor="blue"
              />
            )}

            {
              pickup?.latitude &&
              destination?.latitude && (

                <MapViewDirections

                  origin={{
                    latitude:
                      pickup.latitude,

                    longitude:
                      pickup.longitude,
                  }}

                  destination={{
                    latitude:
                      destination.latitude,

                    longitude:
                      destination.longitude,
                  }}

                  apikey={
                    GOOGLE_API_KEY
                  }

                  strokeWidth={5}

                  strokeColor="black"
                />
              )
            }

          </MapView>

        </View>

        {/* RECENT RIDES */}

        <Text style={styles.recentTitle}>
          Recent Rides
        </Text>

        <FlatList

          data={recentRides}

          keyExtractor={(item) =>
            item.id.toString()
          }

          scrollEnabled={false}

          contentContainerStyle={{
            paddingHorizontal: 20,
          }}

          renderItem={renderRide}

          ListEmptyComponent={

            <View style={styles.emptyContainer}>

              <Text style={styles.emptyText}>
                No recent rides yet
              </Text>

            </View>
          }
        />

      </ScrollView>

      {/* FLOATING TAB */}

      <View style={styles.bottomTab}>

        <TouchableOpacity
          onPress={() =>
            router.push("/(rider)/home")
          }
        >

          <Image
            source={require("../../assets/icons/home.png")}
            style={styles.tabIcon}
          />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/(rider)/history")
          }
        >

          <Image
            source={require("../../assets/icons/list.png")}
            style={styles.tabIcon}
          />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push("/(rider)/profile")
          }
        >

          <Image
            source={require("../../assets/icons/profile.png")}
            style={styles.tabIcon}
          />

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallText: {
    color: "gray",
    fontSize: 15,
  },

  welcome: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 4,
  },

  profileImage: {
    width: 45,
    height: 45,
    tintColor: "black",
    resizeMode: "contain",
  },

  searchCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 28,
    padding: 20,
    elevation: 4,
  },

  searchTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  findButton: {
    backgroundColor: "black",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  findText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  mapContainer: {
    marginHorizontal: 20,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
  },

  map: {
    width: width - 40,
    height: 280,
  },

  recentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 18,
    paddingHorizontal: 20,
  },

  rideCard: {
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 24,
    padding: 18,
    elevation: 3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: "black",
    marginRight: 12,
  },

  line: {
    width: 2,
    height: 28,
    backgroundColor: "#ddd",
    marginLeft: 5,
    marginVertical: 6,
  },

  locationText: {
    flex: 1,
    color: "#333",
    fontSize: 15,
  },

  rideBottom: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
  },

  status: {
    color: "#16a34a",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  emptyText: {
    color: "gray",
    fontSize: 15,
  },

  bottomTab: {

    position: "absolute",

    bottom: 20,

    left: 20,

    right: 20,

    backgroundColor: "black",

    borderRadius: 28,

    paddingVertical: 18,

    flexDirection: "row",

    justifyContent: "space-around",

    alignItems: "center",

    elevation: 10,
  },

  tabIcon: {

    width: 26,

    height: 26,

    resizeMode: "contain",

    tintColor: "white",
  },
});