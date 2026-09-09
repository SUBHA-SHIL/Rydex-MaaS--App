import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  router,
} from "expo-router";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function History() {

  const [rides, setRides] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {

    fetchRideHistory();

  }, []);

  const fetchRideHistory =
    async () => {

      try {

        const user =
          JSON.parse(
            await AsyncStorage.getItem(
              "user"
            )
          );

        const response =
          await axios.get(
            `${API_URL}/api/history/${user.id}`
          );

        const sortedRides =
          response.data.sort(
            (a, b) =>
              new Date(
                b.created_at
              ) -
              new Date(
                a.created_at
              )
          );

        setRides(
          sortedRides
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  const onRefresh =
    async () => {

      setRefreshing(true);

      await fetchRideHistory();

      setRefreshing(false);
    };

  const renderRide =
    ({ item }) => (

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.rideCard}
      >

        {/* TOP */}

        <View style={styles.topRow}>

          <View
            style={styles.statusContainer}
          >

            <Text style={styles.status}>
              {item.status}
            </Text>

          </View>

          <Text style={styles.price}>
            ₹{item.fare}
          </Text>

        </View>

        {/* LOCATIONS */}

        <View
          style={{
            marginTop: 18,
          }}
        >

          <View
            style={
              styles.locationRow
            }
          >

            <View
              style={styles.pickupDot}
            />

            <Text
              style={
                styles.locationText
              }
              numberOfLines={2}
            >
              {item.pickup_address}
            </Text>

          </View>

          <View
            style={
              styles.lineContainer
            }
          >

            <View
              style={
                styles.verticalLine
              }
            />

          </View>

          <View
            style={
              styles.locationRow
            }
          >

            <View
              style={styles.dropDot}
            />

            <Text
              style={
                styles.locationText
              }
              numberOfLines={2}
            >
              {item.drop_address}
            </Text>

          </View>

        </View>

        {/* BOTTOM */}

        <View
          style={
            styles.bottomRow
          }
        >

          <Text
            style={
              styles.dateText
            }
          >

            {
              item.created_at
                ? new Date(
                    item.created_at
                  ).toLocaleDateString()
                : "Recent Ride"
            }

          </Text>

          <Text
            style={
              styles.paymentMethod
            }
          >

            {
              item.payment_method ||
              "ONLINE"
            }

          </Text>

        </View>

      </TouchableOpacity>
    );

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="black"
        />

        <Text
          style={{
            marginTop: 15,
          }}
        >
          Loading rides...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Ride History
        </Text>

        <Text style={styles.subtitle}>
          Your completed rides
        </Text>

      </View>

      {/* EMPTY */}

      {rides.length === 0 ? (

        <View style={styles.emptyBox}>

          <Text style={styles.emptyTitle}>
            No rides yet
          </Text>

          <Text style={styles.emptyText}>
            Your ride history will appear here
          </Text>

          <TouchableOpacity

            style={
              styles.bookButton
            }

            onPress={() =>
              router.push(
                "/(rider)/home"
              )
            }
          >

            <Text
              style={
                styles.bookButtonText
              }
            >
              Book Ride
            </Text>

          </TouchableOpacity>

        </View>

      ) : (

        <FlatList

          data={rides}

          keyExtractor={(item) =>
            item.id.toString()
          }

          renderItem={renderRide}

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={{
            paddingBottom: 140,
            paddingHorizontal: 20,
          }}

          refreshControl={
            <RefreshControl

              refreshing={
                refreshing
              }

              onRefresh={
                onRefresh
              }

              tintColor="black"
            />
          }
        />
      )}

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

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#f5f5f5",
    },

    header: {
      paddingTop: 70,
      paddingHorizontal: 20,
      marginBottom: 25,
    },

    title: {
      fontSize: 34,
      fontWeight: "bold",
      color: "#111",
    },

    subtitle: {
      marginTop: 8,
      fontSize: 16,
      color: "gray",
    },

    rideCard: {
      backgroundColor:
        "white",

      borderRadius: 24,

      padding: 20,

      marginBottom: 18,

      elevation: 3,
    },

    topRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    statusContainer: {
      backgroundColor:
        "#dcfce7",

      paddingHorizontal: 14,

      paddingVertical: 8,

      borderRadius: 100,
    },

    status: {
      color: "#15803d",
      fontWeight: "bold",
      textTransform:
        "capitalize",
    },

    price: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#111",
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
        "black",
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

    verticalLine: {
      width: 2,
      flex: 1,
      backgroundColor:
        "#d1d5db",
    },

    lineContainer: {
      height: 32,
      marginLeft: 6,
      marginVertical: 4,
    },

    locationText: {
      flex: 1,
      fontSize: 15,
      color: "#333",
      lineHeight: 22,
    },

    bottomRow: {
      marginTop: 22,
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      borderTopWidth: 1,
      borderTopColor:
        "#eee",
      paddingTop: 15,
    },

    dateText: {
      color: "gray",
      fontSize: 14,
    },

    paymentMethod: {
      fontWeight: "bold",
      color: "#111",
    },

    emptyBox: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal: 30,
    },

    emptyTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#111",
    },

    emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: "gray",
      textAlign: "center",
      lineHeight: 24,
    },

    bookButton: {
      marginTop: 30,
      backgroundColor:
        "black",
      paddingHorizontal: 28,
      paddingVertical: 16,
      borderRadius: 18,
    },

    bookButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
  });