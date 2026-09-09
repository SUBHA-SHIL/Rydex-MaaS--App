import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import * as Location from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import socket from "../../hooks/useSocket";

import { router } from "expo-router";

import useAuthStore from "../../store/authStore";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

const { width } =
  Dimensions.get("window");

export default function Dashboard() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const [location, setLocation] =
    useState(null);

  const [online, setOnline] =
    useState(true);

  const [rides, setRides] =
    useState([]);

  const [earnings, setEarnings] =
    useState(0);

  useEffect(() => {

    getDriverLocation();

    fetchPendingRides();

    fetchEarnings();
    socket.emit(
      "registerDriver",
      user.id
    );

    fetchPendingRides();

    fetchEarnings();


    socket.on(
      "newRideRequest",
      (ride) => {

        setRides((prev) => {

          const exists =
            prev.some(
              (item) =>
                item.id === ride.id
            );

          if (exists) {
            return prev;
          }

          return [
            ride,
            ...prev,
          ];
        });
      }
    );

    socket.on(
      "rideAccepted",
      (acceptedRide) => {

        setRides((prev) =>
          prev.filter(
            (ride) =>
              ride.id !==
              acceptedRide.id
          )
        );
      }
    );

    socket.on(
      "paymentCompleted",
      (ride) => {

        router.push({
          pathname:
            "/(driver)/active-ride",

          params: {
            ride:
              JSON.stringify(ride),
          },
        });
      }
    );

    socket.on(
      "earningsUpdated",
      (data) => {

        if (
          data.driver_id === user.id
        ) {

          setEarnings(
            data.earnings
          );
        }
      }
    );

    return () => {

      socket.off(
        "newRideRequest"
      );

      socket.off(
        "rideAccepted"
      );

      socket.off(
        "earningsUpdated"
      );
    };

  }, []);

  const getDriverLocation =
    async () => {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (
          status !== "granted"
        ) {
          return;
        }

        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 4000,

            distanceInterval: 10,
          },

          async (loc) => {

            const coords =
              loc.coords;

            setLocation(coords);

            socket.emit(
              "updateDriverLocation",
              {
                driver_id:
                  user.id,

                latitude:
                  coords.latitude,

                longitude:
                  coords.longitude,
              }
            );

            await axios.post(
              `${API_URL}/api/drivers/location`,
              {
                driver_id:
                  user.id,

                latitude:
                  coords.latitude,

                longitude:
                  coords.longitude,
              }
            );
          }
        );

      } catch (error) {

        console.log(error);
      }
    };

  const fetchEarnings =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/drivers/earnings/${user.id}`
          );

        setEarnings(
          response.data
            .earnings || 0
        );

      } catch (error) {

        console.log(error);
      }
    };

  const fetchPendingRides =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/rides/pending`
          );

        setRides(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  const acceptRide =
    async (ride) => {

      try {

        await axios.post(
          `${API_URL}/api/rides/accept`,
          {
            ride_id: ride.id,
            driver_id:
              user.id,
          }
        );

        socket.emit(
          "rideAccepted",
          {
            ...ride,
            status:
              "ACCEPTED",
            driver_id:
              user.id,
          }
        );

        router.push({
          pathname:
            "/(driver)/active-ride",

          params: {
            ride:
              JSON.stringify({
                ...ride,
                driver_id:
                  user.id,
                status:
                  "ACCEPTED",
              }),
          },
        });

      } catch (error) {

        console.log(error);

        alert(
          "Failed to accept ride"
        );
      }
    };

  const toggleOnlineStatus =
    async () => {

      try {

        const newStatus =
          !online;

        setOnline(newStatus);

        await axios.post(
          `${API_URL}/api/drivers/status`,
          {
            driver_id:
              user.id,

            is_online:
              newStatus,
          }
        );

      } catch (error) {

        console.log(error);
      }
    };

  const handleLogout =
    async () => {

      await AsyncStorage.clear();

      logout();

      router.replace(
        "/(auth)/welcome"
      );
    };

  if (!location) {

    return (

      <View style={styles.loadingContainer}>

        <Text
          style={styles.loadingText}
        >
          Loading Dashboard...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View>

            <Text style={styles.hello}>
              Hello Driver 👋
            </Text>

            <Text style={styles.name}>
              {user?.name}
            </Text>

          </View>

          <TouchableOpacity
            style={
              styles.logoutButton
            }
            onPress={handleLogout}
          >

            <Image
              source={require("../../assets/icons/profile.png")}
              style={
                styles.headerIcon
              }
            />

          </TouchableOpacity>

        </View>

        {/* ONLINE CARD */}

        <View style={styles.onlineCard}>

          <View>

            <Text
              style={
                styles.onlineTitle
              }
            >
              Driver Status
            </Text>

            <Text
              style={
                styles.onlineSubtitle
              }
            >

              {online
                ? "You are online and receiving ride requests"
                : "You are offline"}

            </Text>

          </View>

          <Switch
            value={online}
            onValueChange={
              toggleOnlineStatus
            }
            trackColor={{
              false: "#ddd",
              true: "#111",
            }}
            thumbColor={
              online
                ? "#fff"
                : "#fff"
            }
          />

        </View>

        {/* STATS */}

        <View
          style={
            styles.statsContainer
          }
        >

          <View
            style={styles.statCard}
          >

            <Text
              style={
                styles.statAmount
              }
            >
              ₹{earnings}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Total Earnings
            </Text>

          </View>

          <View
            style={styles.statCard}
          >

            <Text
              style={
                styles.statAmount
              }
            >
              {rides.length}
            </Text>

            <Text
              style={
                styles.statLabel
              }
            >
              Ride Requests
            </Text>

          </View>

        </View>

        {/* MAP */}

        <View style={styles.mapCard}>

          <View
            style={
              styles.mapHeader
            }
          >

            <Text
              style={
                styles.mapTitle
              }
            >
              Live Location
            </Text>

            <View
              style={
                styles.liveBadge
              }
            >

              <View
                style={
                  styles.liveDot
                }
              />

              <Text
                style={
                  styles.liveText
                }
              >
                LIVE
              </Text>

            </View>

          </View>

          <MapView
            style={styles.map}
            region={{
              latitude:
                location.latitude,

              longitude:
                location.longitude,

              latitudeDelta:
                0.02,

              longitudeDelta:
                0.02,
            }}
            showsUserLocation
          >

            <Marker
              coordinate={{
                latitude:
                  location.latitude,

                longitude:
                  location.longitude,
              }}
            >

              <Image
                source={require("../../assets/icons/marker.png")}
                style={{
                  width: 45,
                  height: 45,
                  resizeMode:
                    "contain",
                }}
              />

            </Marker>

          </MapView>

        </View>

        {/* REQUESTS */}

        <View
          style={
            styles.requestsSection
          }
        >

          <View
            style={
              styles.requestHeader
            }
          >

            <Text
              style={
                styles.requestTitle
              }
            >
              Incoming Requests
            </Text>

            <Text
              style={
                styles.requestCount
              }
            >
              {rides.length}
            </Text>

          </View>

          {rides.length ===
            0 ? (

            <View
              style={
                styles.emptyContainer
              }
            >

              <Image
                source={require("../../assets/icons/list.png")}
                style={
                  styles.emptyIcon
                }
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Ride Requests
              </Text>

              <Text
                style={
                  styles.emptySubtitle
                }
              >
                Waiting for new ride requests...
              </Text>

            </View>

          ) : (

            rides.map((item) => (

              <View
                key={item.id}
                style={
                  styles.rideCard
                }
              >

                <View
                  style={
                    styles.routeSection
                  }
                >

                  <View
                    style={
                      styles.locationRow
                    }
                  >

                    <View
                      style={
                        styles.pickupDot
                      }
                    />

                    <Text
                      numberOfLines={
                        1
                      }
                      style={
                        styles.locationText
                      }
                    >
                      {
                        item.pickup_address
                      }
                    </Text>

                  </View>

                  <View
                    style={
                      styles.routeLine
                    }
                  />

                  <View
                    style={
                      styles.locationRow
                    }
                  >

                    <View
                      style={
                        styles.dropDot
                      }
                    />

                    <Text
                      numberOfLines={
                        1
                      }
                      style={
                        styles.locationText
                      }
                    >
                      {
                        item.drop_address
                      }
                    </Text>

                  </View>

                  <Text
                    style={
                      styles.fare
                    }
                  >
                    ₹{item.fare}
                  </Text>

                </View>

                <TouchableOpacity
                  style={
                    styles.acceptButton
                  }
                  onPress={() =>
                    acceptRide(
                      item
                    )
                  }
                >

                  <Text
                    style={
                      styles.acceptText
                    }
                  >
                    Accept
                  </Text>

                </TouchableOpacity>

              </View>
            ))
          )}

        </View>

      </ScrollView>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        "#f3f4f6",
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
      fontSize: 16,
      fontWeight: "600",
    },

    header: {
      paddingTop: 70,
      paddingHorizontal: 22,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    hello: {
      fontSize: 16,
      color: "#666",
    },

    name: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#111",
      marginTop: 4,
    },

    logoutButton: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor:
        "#111",
      justifyContent:
        "center",
      alignItems: "center",
    },

    headerIcon: {
      width: 24,
      height: 24,
      tintColor: "white",
      resizeMode:
        "contain",
    },

    onlineCard: {
      marginHorizontal: 20,
      marginTop: 25,
      backgroundColor:
        "#111",
      borderRadius: 28,
      padding: 24,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    onlineTitle: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
    },

    onlineSubtitle: {
      color: "#bbb",
      marginTop: 8,
      width: width * 0.55,
      lineHeight: 20,
    },

    statsContainer: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      paddingHorizontal: 20,
      marginTop: 22,
    },

    statCard: {
      width: "48%",
      backgroundColor:
        "white",
      borderRadius: 24,
      paddingVertical: 28,
      alignItems: "center",
      elevation: 4,
    },

    statAmount: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#111",
    },

    statLabel: {
      marginTop: 10,
      fontSize: 14,
      color: "#777",
    },

    mapCard: {
      marginTop: 25,
      marginHorizontal: 20,
      backgroundColor:
        "white",
      borderRadius: 28,
      padding: 16,
      elevation: 4,
    },

    mapHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 15,
    },

    mapTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#111",
    },

    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        "#111",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 100,
      backgroundColor:
        "#22c55e",
      marginRight: 6,
    },

    liveText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },

    map: {
      width: "100%",
      height: 250,
      borderRadius: 22,
    },

    requestsSection: {
      marginTop: 28,
      paddingHorizontal: 20,
    },

    requestHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 18,
    },

    requestTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#111",
    },

    requestCount: {
      backgroundColor:
        "#111",
      color: "white",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 100,
      fontWeight: "bold",
    },

    emptyContainer: {
      backgroundColor:
        "white",
      borderRadius: 28,
      paddingVertical: 50,
      alignItems: "center",
      elevation: 3,
    },

    emptyIcon: {
      width: 50,
      height: 50,
      tintColor: "#999",
      resizeMode:
        "contain",
      marginBottom: 15,
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#111",
    },

    emptySubtitle: {
      marginTop: 8,
      color: "#777",
    },

    rideCard: {
      backgroundColor:
        "white",
      borderRadius: 26,
      padding: 20,
      marginBottom: 18,
      elevation: 3,
    },

    routeSection: {
      marginBottom: 20,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    pickupDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor:
        "#111",
      marginRight: 14,
    },

    dropDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor:
        "#22c55e",
      marginRight: 14,
    },

    routeLine: {
      width: 2,
      height: 26,
      backgroundColor:
        "#ddd",
      marginLeft: 6,
      marginVertical: 6,
    },

    locationText: {
      flex: 1,
      fontSize: 15,
      color: "#333",
      fontWeight: "500",
    },

    fare: {
      marginTop: 18,
      fontSize: 28,
      fontWeight: "bold",
      color: "#111",
    },

    acceptButton: {
      backgroundColor:
        "#111",
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
    },

    acceptText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });