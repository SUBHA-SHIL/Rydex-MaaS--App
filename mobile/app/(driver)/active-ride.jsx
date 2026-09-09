import axios from "axios";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";


import MapViewDirections from "react-native-maps-directions";

import {
  useEffect,
  useState,
} from "react";

import * as Location from "expo-location";

import socket from "../../hooks/useSocket";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const { width } =
  Dimensions.get("window");

export default function ActiveRide() {

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  const [location, setLocation] =
    useState(null);

  const [rideStatus, setRideStatus] =
    useState(
      ride.status || "ACCEPTED"
    );

  const [otpModal, setOtpModal] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    let subscription;

    const startTracking =
      async () => {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          return;
        }

        subscription =
          await Location.watchPositionAsync(
            {
              accuracy:
                Location.Accuracy.High,

              timeInterval: 3000,

              distanceInterval: 10,
            },

            async (loc) => {

              const coords =
                loc.coords;

              setLocation(coords);

              try {

                await axios.post(
                  `${API_URL}/api/drivers/location`,
                  {
                    driver_id:
                      ride.driver_id,

                    latitude:
                      coords.latitude,

                    longitude:
                      coords.longitude,
                  }
                );

                socket.emit(
                  "driverLocationUpdate",
                  {
                    ride_id:
                      ride.id,

                    latitude:
                      coords.latitude,

                    longitude:
                      coords.longitude,
                  }
                );

              } catch (error) {

                console.log(error);
              }
            }
          );
      };

    startTracking();

    return () => {

      if (subscription) {
        subscription.remove();
      }
    };

  }, []);

  const updateRideStatus =
    async (status) => {

      try {

        await axios.post(
          `${API_URL}/api/rides/status`,
          {
            ride_id: ride.id,
            status,
          }
        );

        if (
          status === "COMPLETED"
        ) {

          socket.emit(
            "rideCompleted",
            ride
          );
        }

        setRideStatus(status);

        if (
          status === "COMPLETED"
        ) {

          alert(
            "Ride Completed Successfully"
          );

          router.replace(
            "/(driver)/dashboard"
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  const verifyOtp =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.post(
            `${API_URL}/api/rides/verify-otp`,
            {
              ride_id: ride.id,
              otp,
            }
          );

        if (
          response.data.success
        ) {

          setRideStatus(
            "STARTED"
          );

          setOtpModal(false);

          setOtp("");

          alert(
            "OTP Verified Successfully"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "Invalid OTP"
        );

      } finally {

        setLoading(false);
      }
    };

  const getButtonText =
    () => {

      if (
        rideStatus ===
        "ACCEPTED"
      ) {
        return "Arrived";
      }

      if (
        rideStatus ===
        "ARRIVED"
      ) {
        return "Start Ride";
      }

      if (
        rideStatus ===
        "STARTED"
      ) {
        return "Complete Ride";
      }

      return "";
    };

  const getNextStatus =
    () => {

      if (
        rideStatus ===
        "ACCEPTED"
      ) {
        return "ARRIVED";
      }

      if (
        rideStatus ===
        "ARRIVED"
      ) {
        return "STARTED";
      }

      if (
        rideStatus ===
        "STARTED"
      ) {
        return "COMPLETED";
      }

      return "";
    };

  if (!location) {

    return (

      <View style={styles.loadingContainer}>

        <Text style={styles.loadingText}>
          Tracking Driver...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      {/* MAP */}

      <MapView
        style={styles.map}
        region={{
          latitude:
            location.latitude,

          longitude:
            location.longitude,

          latitudeDelta: 0.01,

          longitudeDelta: 0.01,
        }}
      >

        {/* DRIVER */}

        <Marker
          coordinate={{
            latitude:
              location.latitude,

            longitude:
              location.longitude,
          }}
          title="Driver"
        >

          <Image
            source={require("../../assets/icons/marker.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode:
                "contain",
            }}
          />

        </Marker>

        {/* PICKUP */}

        <Marker
          coordinate={{
            latitude:
              ride.pickup_latitude,

            longitude:
              ride.pickup_longitude,
          }}
          title="Pickup"
        />

        {/* DROP */}

        <Marker
          coordinate={{
            latitude:
              ride.drop_latitude,

            longitude:
              ride.drop_longitude,
          }}
          title="Destination"
          pinColor="green"
        />

        {/* ROUTE */}

        <MapViewDirections

          origin={{
            latitude:
              location.latitude,

            longitude:
              location.longitude,
          }}

          destination={{
            latitude:
              ride.drop_latitude,

            longitude:
              ride.drop_longitude,
          }}

          apikey={
            GOOGLE_API_KEY
          }

          strokeWidth={5}

          strokeColor="black"
        />

      </MapView>

      {/* TOP STATUS CARD */}

      <View style={styles.topCard}>

        <View style={styles.liveContainer}>

          <View style={styles.liveDot} />

          <Text style={styles.liveText}>
            Ride Active
          </Text>

        </View>

        <Text style={styles.statusText}>
          {rideStatus}
        </Text>

      </View>

      {/* BOTTOM CARD */}

      <View style={styles.bottomCard}>

        <View style={styles.dragIndicator} />

        <Text style={styles.title}>
          Current Ride
        </Text>

        {/* PICKUP */}

        <View style={styles.locationCard}>

          <View
            style={styles.locationRow}
          >

            <View
              style={styles.pickupDot}
            />

            <View
              style={styles.locationInfo}
            >

              <Text
                style={styles.locationLabel}
              >
                Pickup
              </Text>

              <Text
                numberOfLines={2}
                style={styles.locationText}
              >
                {
                  ride.pickup_address
                }
              </Text>

            </View>

          </View>

          <View
            style={styles.routeLine}
          />

          {/* DROP */}

          <View
            style={styles.locationRow}
          >

            <View
              style={styles.dropDot}
            />

            <View
              style={styles.locationInfo}
            >

              <Text
                style={styles.locationLabel}
              >
                Destination
              </Text>

              <Text
                numberOfLines={2}
                style={styles.locationText}
              >
                {
                  ride.drop_address
                }
              </Text>

            </View>

          </View>

        </View>

        {/* FARE CARD */}

        <View style={styles.fareCard}>

          <Text style={styles.fareLabel}>
            Ride Fare
          </Text>

          <Text style={styles.fare}>
            ₹{ride.fare}
          </Text>

        </View>

        <TouchableOpacity

          style={styles.chatButton}

          onPress={() =>

            router.push({
              pathname:
                "/(driver)/chat-room",

              params: {
                ride:
                  JSON.stringify(ride),
              },
            })
          }
        >

          <Text style={styles.chatText}>
            Chat With Rider
          </Text>

        </TouchableOpacity>

        {/* BUTTON */}

        {rideStatus !==
          "COMPLETED" && (

            <TouchableOpacity

              style={styles.actionButton}

              onPress={() => {

                // ACCEPTED -> ARRIVED

                if (
                  rideStatus ===
                  "ACCEPTED"
                ) {

                  updateRideStatus(
                    "ARRIVED"
                  );

                  return;
                }

                // ARRIVED -> OTP VERIFY

                if (
                  rideStatus ===
                  "ARRIVED"
                ) {

                  setOtpModal(true);

                  return;
                }

                // STARTED -> COMPLETED

                if (
                  rideStatus ===
                  "STARTED"
                ) {

                  updateRideStatus(
                    "COMPLETED"
                  );
                }
              }}
            >

              <Text
                style={styles.actionText}
              >
                {getButtonText()}
              </Text>

            </TouchableOpacity>
          )}

      </View>

      <Modal
        visible={otpModal}
        transparent
        animationType="slide"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Verify Ride OTP
            </Text>

            <Text style={styles.modalSubtitle}>
              Ask rider for the 4-digit OTP
            </Text>

            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={4}
              style={styles.otpInput}
            />

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={verifyOtp}
            >

              <Text style={styles.verifyText}>

                {loading
                  ? "Verifying..."
                  : "Verify OTP"}

              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setOtpModal(false)
              }
            >

              <Text style={styles.cancelText}>
                Cancel
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#f5f5f5",
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#fff",
    },

    loadingText: {
      fontSize: 18,
      fontWeight: "600",
    },

    map: {
      flex: 1,
    },

    topCard: {

      position: "absolute",

      top: 65,

      left: 20,

      right: 20,

      backgroundColor:
        "#111",

      borderRadius: 24,

      padding: 18,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      elevation: 8,
    },

    liveContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    liveDot: {
      width: 10,
      height: 10,
      borderRadius: 100,
      backgroundColor:
        "#22c55e",
      marginRight: 8,
    },

    liveText: {
      color: "white",
      fontSize: 15,
      fontWeight: "600",
    },

    statusText: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
    },

    bottomCard: {

      position: "absolute",

      bottom: 95,

      left: 0,

      right: 0,

      backgroundColor:
        "white",

      borderTopLeftRadius: 34,

      borderTopRightRadius: 34,

      padding: 24,

      elevation: 15,
    },

    dragIndicator: {
      width: 70,
      height: 6,
      borderRadius: 100,
      backgroundColor:
        "#ddd",
      alignSelf: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#111",
      marginBottom: 22,
    },

    locationCard: {
      backgroundColor:
        "#f8f8f8",
      borderRadius: 24,
      padding: 18,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    pickupDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor:
        "#111",
      marginTop: 5,
      marginRight: 14,
    },

    dropDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor:
        "#16a34a",
      marginTop: 5,
      marginRight: 14,
    },

    routeLine: {
      width: 2,
      height: 32,
      backgroundColor:
        "#ddd",
      marginLeft: 6,
      marginVertical: 8,
    },

    locationInfo: {
      flex: 1,
    },

    locationLabel: {
      fontSize: 13,
      color: "#777",
      marginBottom: 4,
    },

    locationText: {
      fontSize: 16,
      color: "#111",
      fontWeight: "600",
      lineHeight: 24,
    },

    fareCard: {

      marginTop: 22,

      backgroundColor:
        "#111",

      borderRadius: 24,

      paddingVertical: 22,

      alignItems: "center",
    },

    fareLabel: {
      color: "#bbb",
      fontSize: 14,
    },

    fare: {
      color: "white",
      fontSize: 36,
      fontWeight: "bold",
      marginTop: 8,
    },

    actionButton: {

      marginTop: 24,

      backgroundColor:
        "#111",

      borderRadius: 22,

      height: 62,

      justifyContent:
        "center",

      alignItems: "center",
    },

    actionText: {
      color: "white",
      fontSize: 17,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalCard: {
      width: "85%",
      backgroundColor: "white",
      borderRadius: 30,
      padding: 24,
    },

    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#111",
    },

    modalSubtitle: {
      marginTop: 8,
      color: "#666",
      marginBottom: 24,
    },

    otpInput: {
      height: 60,
      borderRadius: 18,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 20,
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 10,
      textAlign: "center",
    },

    verifyButton: {
      marginTop: 22,
      backgroundColor: "#111",
      height: 58,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },

    verifyText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },

    cancelText: {
      textAlign: "center",
      marginTop: 18,
      color: "red",
      fontWeight: "600",
    },
    chatButton: {
  marginTop: 16,
  backgroundColor: "#f5f5f5",
  height: 58,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
},

chatText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#111",
},
  });