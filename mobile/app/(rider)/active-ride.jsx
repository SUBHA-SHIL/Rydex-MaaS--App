import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
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

import socket from "../../hooks/useSocket";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

const { width, height } =
  Dimensions.get("window");

export default function ActiveRide() {

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  const [driverLocation, setDriverLocation] =
    useState({
      latitude:
        ride.pickup_latitude,

      longitude:
        ride.pickup_longitude,
    });

  const [rideStatus, setRideStatus] =
    useState(
      ride.status || "ACCEPTED"
    );

  const [otp, setOtp] =
    useState("");

  const [showOtp, setShowOtp] =
    useState(false);

  useEffect(() => {

    socket.on(
      "rideOtpGenerated",
      (updatedRide) => {
        console.log(
          "OTP RECEIVED:",
          updatedRide
        );

        if (
          updatedRide.id === ride.id
        ) {

          setOtp(
            updatedRide.otp
          );

          setShowOtp(true);
        }
      }
    );


    socket.on(
      "rideStatusUpdated",
      (updatedRide) => {

        if (
          updatedRide.id === ride.id
        ) {

          setRideStatus(
            updatedRide.status
          );

          // OPTIONAL ALERTS

          if (
            updatedRide.status ===
            "ARRIVED"
          ) {

            alert(
              "Driver has arrived"
            );
          }

          if (
            updatedRide.status ===
            "STARTED"
          ) {

            alert(
              "Ride Started"
            );
          }

          if (
            updatedRide.status ===
            "COMPLETED"
          ) {

            alert(
              "Ride Completed"
            );

            router.replace(
              "/(rider)/home"
            );
          }
        }
      }
    );

    return () => {

      socket.off(
        "rideStatusUpdated",
        "rideOtpGenerated"
      );
    };

  }, []);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    socket.on(
      "driverLocation",
      (data) => {

        if (
          data.ride_id === ride.id
        ) {

          setDriverLocation({
            latitude:
              data.latitude,

            longitude:
              data.longitude,
          });
        }
      }
    );

    socket.on(
      "rideStatusUpdated",
      (updatedRide) => {

        if (
          updatedRide.id === ride.id
        ) {

          setRideStatus(
            updatedRide.status
          );
        }
      }
    );

    return () => {

      socket.off(
        "driverLocation"
      );

      socket.off(
        "rideStatusUpdated"
      );
    };

  }, []);

  const completeRide =
    async () => {

      try {

        setLoading(true);

        await axios.post(
          `${API_URL}/api/rides/status`,
          {
            ride_id: ride.id,
            status: "COMPLETED",
          }
        );

        setRideStatus(
          "COMPLETED"
        );

        alert(
          "Ride Completed Successfully"
        );

        router.replace(
          "/(rider)/home"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to complete ride"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <FlatList

      data={[ride]}

      keyExtractor={(item) =>
        item.id.toString()
      }

      showsVerticalScrollIndicator={
        false
      }

      contentContainerStyle={{
        paddingBottom: 50,
        backgroundColor: "#f5f5f5",
      }}

      ListHeaderComponent={

        <>
          {/* MAP */}

          <MapView
            style={styles.map}
            initialRegion={{
              latitude:
                ride.pickup_latitude,

              longitude:
                ride.pickup_longitude,

              latitudeDelta: 0.02,

              longitudeDelta: 0.02,
            }}
          >

            {/* DRIVER */}


            <Marker
              coordinate={{
                latitude:
                  driverLocation.latitude,

                longitude:
                  driverLocation.longitude,
              }}
              title="Driver"
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

            {/* DESTINATION */}

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
                  driverLocation.latitude,

                longitude:
                  driverLocation.longitude,
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

          {/* STATUS CARD */}

          <View style={styles.statusCard}>

            <View
              style={styles.statusTop}
            >

              <Text
                style={styles.statusTitle}
              >
                Ride Status
              </Text>

              <View
                style={styles.statusBadge}
              >

                <Text
                  style={styles.statusText}
                >
                  {rideStatus}
                </Text>

              </View>

            </View>

            <Text style={styles.address}>
              {ride.pickup_address}
            </Text>

            <Text style={styles.arrow}>
              ↓
            </Text>

            <Text style={styles.address}>
              {ride.drop_address}
            </Text>

            <View
              style={styles.infoRow}
            >

              <View
                style={styles.infoCard}
              >

                <Text
                  style={styles.infoValue}
                >
                  ₹{ride.fare}
                </Text>

                <Text
                  style={styles.infoLabel}
                >
                  Fare
                </Text>

              </View>

              <View
                style={styles.infoCard}
              >

                <Text
                  style={styles.infoValue}
                >
                  Cash
                </Text>

                <Text
                  style={styles.infoLabel}
                >
                  Payment
                </Text>

              </View>

            </View>

          </View>

          {
            showOtp && (

              <View style={styles.otpCard}>

                <Text style={styles.otpLabel}>
                  Ride OTP
                </Text>

                <Text style={styles.otpValue}>
                  {otp}
                </Text>

                <Text style={styles.otpInfo}>
                  Share this OTP with driver
                </Text>

              </View>
            )
          }

          <TouchableOpacity

            style={styles.chatButton}

            onPress={() =>

              router.push({
                pathname:
                  "/(rider)/chat-room",

                params: {
                  ride:
                    JSON.stringify(ride),
                },
              })
            }
          >

            <Text style={styles.chatText}>
              Chat With Driver
            </Text>

          </TouchableOpacity>


          {/* COMPLETE BUTTON */}

          {
            rideStatus !==
            "COMPLETED" && (

              <TouchableOpacity

                style={
                  styles.completeButton
                }

                onPress={
                  completeRide
                }

                disabled={loading}
              >

                {
                  loading ? (

                    <ActivityIndicator
                      color="white"
                    />

                  ) : (

                    <Text
                      style={
                        styles.completeText
                      }
                    >
                      Complete Ride
                    </Text>
                  )
                }

              </TouchableOpacity>
            )
          }

        </>
      }

      renderItem={() => null}
    />
  );
}

const styles = StyleSheet.create({

  map: {
    width,
    height: height * 0.48,
  },

  statusCard: {
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    elevation: 5,
  },

  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  statusBadge: {
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },

  statusText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  address: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  arrow: {
    fontSize: 20,
    marginVertical: 10,
    color: "gray",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },

  infoValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  infoLabel: {
    marginTop: 8,
    color: "gray",
  },

  completeButton: {
    backgroundColor: "black",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 5,
  },

  completeText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  otpCard: {

    position: "absolute",
    top: 155,
    left: 20,
    right: 20,
    backgroundColor: "#111",
    borderRadius: 28,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  otpLabel: {
    color: "#bbb",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },

  otpValue: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 14,
    marginTop: 14,
  },

  otpInfo: {
    color: "#999",
    fontSize: 14,
    marginTop: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
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