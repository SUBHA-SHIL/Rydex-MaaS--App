import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";

import { router } from "expo-router";

const { width, height } =
  Dimensions.get("window");

export default function Welcome() {

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      {/* BACKGROUND CIRCLES */}

      <View style={styles.circleOne} />

      <View style={styles.circleTwo} />

      {/* TOP SECTION */}

      <View style={styles.topSection}>

        <View style={styles.logoContainer}>

          <Image
            source={require("../../assets/images/icon1.png")}
            style={styles.logo}
          />

        </View>

        <Text style={styles.title}>
          Rydex
        </Text>

        <Text style={styles.subtitle}>
          Real-time ride booking experience
          built with live tracking, smart
          dispatching and seamless mobility.
        </Text>

      </View>

      {/* FEATURE CARDS */}

      <View style={styles.featureContainer}>

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            🚖
          </Text>

          <View>

            <Text style={styles.featureTitle}>
              Smart Ride Dispatch
            </Text>

            <Text style={styles.featureText}>
              Connect riders and drivers instantly
            </Text>

          </View>

        </View>

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            📍
          </Text>

          <View>

            <Text style={styles.featureTitle}>
              Live GPS Tracking
            </Text>

            <Text style={styles.featureText}>
              Real-time location updates
            </Text>

          </View>

        </View>

        <View style={styles.featureCard}>

          <Text style={styles.featureIcon}>
            🔐
          </Text>

          <View>

            <Text style={styles.featureTitle}>
              OTP Ride Security
            </Text>

            <Text style={styles.featureText}>
              Secure ride verification system
            </Text>

          </View>

        </View>

      </View>

      {/* BUTTON */}

      <View style={styles.bottomSection}>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() =>
            router.push("/(auth)/sign-in")
          }
        >

          <Text style={styles.buttonText}>
            Get Started
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0f0f10",
    paddingHorizontal: 24,
  },

  circleOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "#1f2937",
    top: -100,
    right: -120,
    opacity: 0.55,
  },

  circleTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "#111827",
    bottom: -80,
    left: -80,
    opacity: 0.7,
  },

  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70,
  },

  logoContainer: {
    width: 340,
    height: 100,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  logo: {
    width: 500,
    height: 500,
    marginTop: 10,
    resizeMode: "contain",
  },

  title: {
    fontSize: 54,
    fontWeight: "900",
    color: "white",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 18,
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 28,
    paddingHorizontal: 12,
  },

  featureContainer: {
    marginBottom: 40,
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  featureIcon: {
    fontSize: 28,
    marginRight: 18,
  },

  featureTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  featureText: {
    color: "#9ca3af",
    marginTop: 4,
    fontSize: 14,
  },

  bottomSection: {
    paddingBottom: 45,
  },

  button: {
    height: 64,
    borderRadius: 22,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  buttonText: {
    color: "#111",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});