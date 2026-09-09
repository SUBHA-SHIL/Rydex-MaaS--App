import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import MapViewDirections from "react-native-maps-directions";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import axios from "axios";

import useAuthStore from "../../store/authStore";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

const { width, height } =
  Dimensions.get("window");

export default function Dispatch() {

  const params =
    useLocalSearchParams();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const pickup =
    params.pickup
      ? JSON.parse(params.pickup)
      : null;

  const drop =
    params.drop
      ? JSON.parse(params.drop)
      : null;

  const [drivers, setDrivers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [distance, setDistance] =
    useState(0);

  const [fare, setFare] =
    useState(0);

  const [booking, setBooking] =
    useState(false);

  useEffect(() => {

    fetchDrivers();

    calculateDistance();

  }, []);

  const fetchDrivers =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/drivers/nearby`,
            {
              params: {
                latitude:
                  pickup.latitude,

                longitude:
                  pickup.longitude,
              },
            }
          );

        setDrivers(
          response.data || []
        );

      } catch (error) {

        console.log(
          "Fetch Drivers Error:",
          error.response?.data || error
        );

      } finally {

        setLoading(false);
      }
    };


  const calculateDistance =
    () => {

      const toRad = (value) =>
        (value * Math.PI) / 180;

      const R = 6371;

      const dLat = toRad(
        drop.latitude -
        pickup.latitude
      );

      const dLon = toRad(
        drop.longitude -
        pickup.longitude
      );

      const lat1 = toRad(
        pickup.latitude
      );

      const lat2 = toRad(
        drop.latitude
      );

      const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      const distanceKm =
        R * c;

      const finalDistance =
        distanceKm.toFixed(1);

      setDistance(finalDistance);

      setFare(
        Math.round(
          finalDistance * 15
        )
      );
    };

  const confirmRide =
    async () => {

      try {

        setBooking(true);

        const response =
          await axios.post(
            `${API_URL}/api/rides/create`,
            {
              rider_id: user.id,

              pickup_address:
                pickup.address,

              drop_address:
                drop.address,

              pickup_latitude:
                pickup.latitude,

              pickup_longitude:
                pickup.longitude,

              drop_latitude:
                drop.latitude,

              drop_longitude:
                drop.longitude,

              fare,
            }
          );

        const ride =
          response.data.ride;

        alert(
          "Searching for drivers..."
        );

        router.push({
          pathname:
            "/(rider)/confirm-ride",

          params: {
            ride:
              JSON.stringify(ride),
          },
        });

      } catch (error) {

        console.log(error);

        alert(
          "Failed to create ride"
        );

      } finally {

        setBooking(false);
      }
    };

  if (!pickup || !drop) {

    return (
      <View style={styles.center}>
        <Text>
          Invalid Route Data
        </Text>
      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* MAP */}

      <MapView

        style={styles.map}

        initialRegion={{
          latitude:
            pickup.latitude,

          longitude:
            pickup.longitude,

          latitudeDelta: 0.05,

          longitudeDelta: 0.05,
        }}
      >

        {/* PICKUP */}

        <Marker
          coordinate={{
            latitude:
              pickup.latitude,

            longitude:
              pickup.longitude,
          }}
          title="Pickup"
        />

        {/* DESTINATION */}

        <Marker
          coordinate={{
            latitude:
              drop.latitude,

            longitude:
              drop.longitude,
          }}
          title="Destination"
          pinColor="green"
        />

        {/* ROUTE */}

        <MapViewDirections

          origin={{
            latitude:
              pickup.latitude,

            longitude:
              pickup.longitude,
          }}

          destination={{
            latitude:
              drop.latitude,

            longitude:
              drop.longitude,
          }}

          apikey={
            GOOGLE_API_KEY
          }

          strokeWidth={5}

          strokeColor="black"
        />

        {/* DRIVERS */}

        {
          drivers.map((driver) => (

            <Marker

              key={driver.id}

              coordinate={{
                latitude:
                  Number(driver.latitude),

                longitude:
                  Number(driver.longitude),
              }}

              title={driver.name}

              description="Nearby Driver"
            >

              <Image
                source={require("../../assets/icons/marker.png")}
                style={{
                  width: 45,
                  height: 45,
                  resizeMode: "contain",
                }}
              />

            </Marker>
          ))
        }

      </MapView>

      {/* TOP SEARCHING CARD */}

      <View style={styles.searchCard}>

        <ActivityIndicator
          size="small"
          color="black"
        />

        <Text style={styles.searchText}>
          Searching Nearby Drivers...
        </Text>

      </View>

      {/* DRIVER LIST */}

      <View style={styles.bottomSheet}>

        <Text style={styles.title}>
          Available Drivers
        </Text>

        {
          loading ? (

            <View style={styles.loaderContainer}>

              <ActivityIndicator
                size="large"
                color="black"
              />

            </View>

          ) : (

            <FlatList

              data={drivers}

              keyExtractor={(item) =>
                item.id.toString()
              }

              showsVerticalScrollIndicator={
                false
              }

              renderItem={({ item }) => (

                <TouchableOpacity

                  style={[
                    styles.driverCard,
                  ]}
                >

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >

                    <Image
                      source={require("../../assets/icons/profile.png")}
                      style={styles.driverImage}
                    />

                    <View
                      style={{
                        marginLeft: 12,
                      }}
                    >

                      <Text style={styles.driverName}>
                        {item.name}
                      </Text>

                      <Text style={styles.driverCar}>
                        Driver ID:
                        {" "}
                        {item.id}
                      </Text>

                    </View>

                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                    }}
                  >

                    <Text style={styles.driverEta}>
                      {distance} km
                    </Text>

                    <Text style={styles.driverFare}>
                      ₹{fare}
                    </Text>

                  </View>

                </TouchableOpacity>
              )}
            />
          )
        }

        {/* CONFIRM BUTTON */}

        {
          <TouchableOpacity

            style={styles.confirmButton}

            onPress={confirmRide}

            disabled={booking}
          >

            <Text style={styles.confirmText}>

              {
                booking
                  ? "Finding Driver..."
                  : "Request Ride"
              }

            </Text>

          </TouchableOpacity>
        }

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  map: {
    width,
    height: height * 0.55,
  },

  searchCard: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },

  searchText: {
    marginLeft: 10,
    fontWeight: "600",
  },

  bottomSheet: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  loaderContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  driverCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },

  driverImage: {
    width: 55,
    height: 55,
    borderRadius: 100,
    resizeMode: "contain",
  },

  driverName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  driverCar: {
    marginTop: 4,
    color: "gray",
  },

  driverEta: {
    fontWeight: "bold",
    fontSize: 15,
  },

  driverFare: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },

  confirmButton: {
    backgroundColor: "black",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  confirmText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});