import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import socket from "../../hooks/useSocket";

export default function ConfirmRide() {

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  const [status, setStatus] =
    useState(
      ride.status || "PENDING"
    );

  useEffect(() => {

    socket.on(
      "rideAccepted",
      (updatedRide) => {

        if (
          updatedRide.id ===
          ride.id
        ) {

          setStatus(
            "ACCEPTED"
          );

          alert(
            "Driver accepted your ride"
          );

          router.replace({
            pathname:
              "/(rider)/payment",

            params: {
              ride:
                JSON.stringify(
                  updatedRide
                ),
            },
          });
        }
      }
    );

    return () => {

      socket.off(
        "rideAccepted"
      );
    };

  }, []);

  return (

    <View style={styles.container}>

      <ActivityIndicator
        size="large"
        color="black"
      />

      <Text style={styles.title}>
        Waiting for driver...
      </Text>

      <Text style={styles.otpText}>
        Ride OTP: {ride.otp}
      </Text>

      <Text style={styles.subtitle}>
        Your ride request has been sent
      </Text>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },

    title: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: "bold",
    },

    subtitle: {
      marginTop: 10,
      color: "gray",
    },
    otpText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "black",
      marginTop: 20,
      textAlign: "center",
    },
  });