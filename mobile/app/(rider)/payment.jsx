import { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";

import axios from "axios";

import {
  useStripe,
} from "@stripe/stripe-react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function Payment() {

  const {
    initPaymentSheet,
    presentPaymentSheet,
  } = useStripe();

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  const fare =
    Number(ride.fare || 0);

  const [paymentMethod, setPaymentMethod] =
    useState("ONLINE");

  const [loading, setLoading] =
    useState(false);

  const completeRideBooking =
    async (method) => {

      try {

        await axios.post(
          `${API_URL}/api/rides/status`,
          {
            ride_id: ride.id,
            status: "ONGOING",
          }
        );

        Alert.alert(
          "Ride Started",
          "Your driver is on the way"
        );

        router.replace({
          pathname:
            "/(rider)/active-ride",

          params: {
            ride:
              JSON.stringify({
                ...ride,
                payment_method:
                  method,
              }),
          },
        });

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Failed to start ride"
        );
      }
    };

  const handleOnlinePayment =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.post(
            `${API_URL}/api/payments/create-payment-intent`,
            {
              amount: fare,
            }
          );

        const clientSecret =
          response.data.clientSecret;

        const { error: initError } =
          await initPaymentSheet({
            merchantDisplayName:
              "Rydex",

            paymentIntentClientSecret:
              clientSecret,

            defaultBillingDetails: {
              name: "Sir",
            },
          });

        if (initError) {

          Alert.alert(
            "Payment Error",
            initError.message
          );

          return;
        }

        const { error } =
          await presentPaymentSheet();

        if (error) {

          Alert.alert(
            "Payment Failed",
            error.message
          );

        } else {

          Alert.alert(
            "Success",
            "Payment completed successfully"
          );

          completeRideBooking(
            "ONLINE"
          );
        }

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleCashPayment =
    async () => {

      Alert.alert(
        "Cash Payment",
        "Pay directly to the driver after ride completion",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Confirm",

            onPress: () => {
              completeRideBooking(
                "CASH"
              );
            },
          },
        ]
      );
    };

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 50,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Ride Payment
        </Text>

        <Text style={styles.subtitle}>
          Choose your payment method
        </Text>

      </View>

      {/* FARE CARD */}

      <View style={styles.fareCard}>

        <Text style={styles.fareLabel}>
          Total Fare
        </Text>

        <Text style={styles.fare}>
          ₹{fare}
        </Text>

      </View>

      {/* RIDE DETAILS */}

      <View style={styles.rideCard}>

        <Text style={styles.sectionTitle}>
          Ride Details
        </Text>

        <View style={styles.locationContainer}>

          <View style={styles.dot} />

          <Text style={styles.locationText}>
            {ride.pickup_address}
          </Text>

        </View>

        <View style={styles.verticalLine} />

        <View style={styles.locationContainer}>

          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  "#16a34a",
              },
            ]}
          />

          <Text style={styles.locationText}>
            {ride.drop_address}
          </Text>

        </View>

      </View>

      {/* PAYMENT OPTIONS */}

      <Text style={styles.paymentTitle}>
        Payment Options
      </Text>

      {/* ONLINE */}

      <TouchableOpacity

        style={[
          styles.paymentCard,

          paymentMethod ===
          "ONLINE" &&

          styles.selectedCard,
        ]}

        onPress={() =>
          setPaymentMethod(
            "ONLINE"
          )
        }
      >

        <View style={styles.paymentLeft}>

          <Image
            source={require("../../assets/icons/dollar.png")}
            style={styles.icon}
          />

          <View>

            <Text style={styles.paymentMethod}>
              Online Payment
            </Text>

            <Text style={styles.paymentDesc}>
              Pay securely using Stripe
            </Text>

          </View>

        </View>

        <View
          style={[
            styles.radio,

            paymentMethod ===
            "ONLINE" &&

            styles.radioActive,
          ]}
        />

      </TouchableOpacity>

      {/* CASH */}

      <TouchableOpacity

        style={[
          styles.paymentCard,

          paymentMethod ===
          "CASH" &&

          styles.selectedCard,
        ]}

        onPress={() =>
          setPaymentMethod(
            "CASH"
          )
        }
      >

        <View style={styles.paymentLeft}>

          <Image
            source={require("../../assets/icons/dollar.png")}
            style={styles.icon}
          />

          <View>

            <Text style={styles.paymentMethod}>
              Cash Payment
            </Text>

            <Text style={styles.paymentDesc}>
              Pay directly to the driver
            </Text>

          </View>

        </View>

        <View
          style={[
            styles.radio,

            paymentMethod ===
            "CASH" &&

            styles.radioActive,
          ]}
        />

      </TouchableOpacity>

      {/* PAY BUTTON */}

      <TouchableOpacity

        style={styles.payButton}

        disabled={loading}

        onPress={() => {

          if (
            paymentMethod ===
            "ONLINE"
          ) {

            handleOnlinePayment();

          } else {

            handleCashPayment();
          }
        }}
      >

        <Text style={styles.payText}>

          {loading
            ? "Processing..."
            : paymentMethod ===
              "ONLINE"
              ? `Pay ₹${fare}`
              : "Confirm Cash Ride"}

        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 70,
    marginBottom: 25,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "gray",
  },

  fareCard: {
    backgroundColor: "black",
    borderRadius: 25,
    paddingVertical: 35,
    alignItems: "center",
    marginBottom: 25,
  },

  fareLabel: {
    color: "#aaa",
    fontSize: 16,
  },

  fare: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 10,
  },

  rideCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 100,
    backgroundColor: "black",
    marginRight: 14,
  },

  verticalLine: {
    width: 2,
    height: 30,
    backgroundColor: "#ddd",
    marginLeft: 6,
    marginVertical: 8,
  },

  locationText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  paymentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },

  paymentCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "black",
  },

  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
    resizeMode: "contain",
  },

  paymentMethod: {
    fontSize: 17,
    fontWeight: "bold",
  },

  paymentDesc: {
    marginTop: 4,
    color: "gray",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#bbb",
  },

  radioActive: {
    backgroundColor: "black",
    borderColor: "black",
  },

  payButton: {
    backgroundColor: "black",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 25,
  },

  payText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});