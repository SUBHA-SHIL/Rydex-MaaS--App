import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import useAuthStore from "../../store/authStore";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function History() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const [rides, setRides] =
    useState([]);

  const [refreshing, setRefreshing] =
    useState(false);

  useEffect(() => {

    fetchRideHistory();

  }, []);

  const fetchRideHistory =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/rides/history/${user.id}`
          );

        setRides(
          response.data
        );

      } catch (error) {

        console.log(error);
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
        activeOpacity={0.9}
        style={styles.card}
      >

        {/* TOP */}

        <View style={styles.topRow}>

          <View
            style={styles.driverInfo}
          >

            <Image
              source={require("../../assets/icons/profile.png")}
              style={styles.avatar}
            />

            <View>

              <Text style={styles.driverName}>
                Ride #{item.id}
              </Text>

              <Text style={styles.date}>
                Completed Ride
              </Text>

            </View>

          </View>

          <View style={styles.priceBox}>

            <Text style={styles.price}>
              ₹{item.fare}
            </Text>

          </View>

        </View>

        {/* LOCATION */}

        <View style={styles.routeContainer}>

          <View
            style={styles.routeLeft}
          >

            <View style={styles.pickupDot} />

            <View style={styles.line} />

            <View style={styles.dropDot} />

          </View>

          <View
            style={styles.routeTextContainer}
          >

            <Text
              numberOfLines={1}
              style={styles.pickup}
            >
              {item.pickup_address}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.drop}
            >
              {item.drop_address}
            </Text>

          </View>

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <View style={styles.statusBadge}>

            <Text style={styles.statusText}>
              COMPLETED
            </Text>

          </View>

          <Text style={styles.payment}>
            {item.payment_method ||
              "CASH"}
          </Text>

        </View>

      </TouchableOpacity>
    );

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Ride History
        </Text>

        <Text style={styles.subtitle}>
          Your completed trips
        </Text>

      </View>

      {/* LIST */}

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
        }}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        ListEmptyComponent={

          <View
            style={styles.emptyContainer}
          >

            <Image
              source={require("../../assets/icons/list.png")}
              style={styles.emptyIcon}
            />

            <Text style={styles.emptyTitle}>
              No Ride History
            </Text>

            <Text style={styles.emptyText}>
              Completed rides will appear here
            </Text>

          </View>
        }
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 20,
    },

    header: {
      marginTop: 65,
      marginBottom: 25,
    },

    title: {
      fontSize: 34,
      fontWeight: "bold",
      color: "#111",
    },

    subtitle: {
      marginTop: 6,
      fontSize: 16,
      color: "gray",
    },

    card: {
      backgroundColor: "white",
      borderRadius: 28,
      padding: 20,
      marginBottom: 18,
      elevation: 3,
    },

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    driverInfo: {
      flexDirection: "row",
      alignItems: "center",
    },

    avatar: {
      width: 55,
      height: 55,
      borderRadius: 100,
      resizeMode: "contain",
      marginRight: 14,
    },

    driverName: {
      fontSize: 18,
      fontWeight: "bold",
    },

    date: {
      marginTop: 4,
      color: "gray",
    },

    priceBox: {
      backgroundColor: "black",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 15,
    },

    price: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },

    routeContainer: {
      flexDirection: "row",
      marginTop: 25,
    },

    routeLeft: {
      alignItems: "center",
      marginRight: 15,
    },

    pickupDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor: "black",
    },

    line: {
      width: 2,
      height: 45,
      backgroundColor: "#ddd",
      marginVertical: 5,
    },

    dropDot: {
      width: 14,
      height: 14,
      borderRadius: 100,
      backgroundColor: "#16a34a",
    },

    routeTextContainer: {
      flex: 1,
      justifyContent: "space-between",
    },

    pickup: {
      fontSize: 15,
      color: "#333",
      marginBottom: 35,
    },

    drop: {
      fontSize: 15,
      color: "#333",
    },

    footer: {
      marginTop: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    statusBadge: {
      backgroundColor: "#dcfce7",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
    },

    statusText: {
      color: "#166534",
      fontWeight: "bold",
      fontSize: 12,
    },

    payment: {
      fontWeight: "bold",
      color: "#444",
    },

    emptyContainer: {
      marginTop: 120,
      alignItems: "center",
    },

    emptyIcon: {
      width: 90,
      height: 90,
      resizeMode: "contain",
      tintColor: "#ccc",
    },

    emptyTitle: {
      marginTop: 25,
      fontSize: 24,
      fontWeight: "bold",
    },

    emptyText: {
      marginTop: 10,
      color: "gray",
      fontSize: 15,
    },
  });