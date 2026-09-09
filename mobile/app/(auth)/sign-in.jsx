import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../lib/api";

import useAuthStore from "../../store/authStore";

const { width } =
  Dimensions.get("window");

export default function SignIn() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.post(
            "/api/auth/signin",
            {
              email,
              password,
            }
          );

        const {
          token,
          user,
        } = response.data;

        await AsyncStorage.setItem(
          "token",
          token
        );

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setAuth({
          user,
          token,
        });

        Alert.alert(
          "Success",
          "Login successful"
        );

        if (
          user.role === "RIDER"
        ) {

          router.replace(
            "/(rider)/home"
          );

        } else {

          router.replace(
            "/(driver)/dashboard"
          );
        }

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          error?.response?.data
            ?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      {/* BACKGROUND */}

      <View style={styles.circleOne} />

      <View style={styles.circleTwo} />

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.welcome}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue your
          ride experience with Rydex.
        </Text>

      </View>

      {/* CARD */}

      <View style={styles.card}>

        {/* EMAIL */}

        <View style={styles.inputWrapper}>

          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

        </View>

        {/* PASSWORD */}

        <View style={styles.inputWrapper}>

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

        </View>

        {/* BUTTON */}

        <TouchableOpacity

          activeOpacity={0.85}

          onPress={handleLogin}

          disabled={loading}

          style={styles.button}
        >

          <Text style={styles.buttonText}>

            {
              loading
                ? "Signing In..."
                : "Sign In"
            }

          </Text>

        </TouchableOpacity>

        {/* FOOTER */}

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/(auth)/sign-up"
            )
          }
          style={styles.footer}
        >

          <Text style={styles.footerText}>
            Don’t have an account?
          </Text>

          <Text style={styles.signup}>
            {" "}Sign Up
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#0f0f10",
      paddingHorizontal: 24,
      justifyContent: "center",
    },

    circleOne: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 300,
      backgroundColor: "#1f2937",
      top: -100,
      right: -120,
      opacity: 0.5,
    },

    circleTwo: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 240,
      backgroundColor: "#111827",
      bottom: -70,
      left: -70,
      opacity: 0.7,
    },

    header: {
      marginBottom: 40,
    },

    welcome: {
      fontSize: 42,
      fontWeight: "900",
      color: "white",
      letterSpacing: 0.5,
    },

    subtitle: {
      marginTop: 14,
      color: "#9ca3af",
      fontSize: 16,
      lineHeight: 28,
      width: width * 0.78,
    },

    card: {
      backgroundColor:
        "rgba(255,255,255,0.05)",
      borderRadius: 32,
      padding: 24,
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.06)",
    },

    inputWrapper: {
      marginBottom: 22,
    },

    label: {
      color: "#d1d5db",
      marginBottom: 10,
      fontSize: 14,
      fontWeight: "600",
    },

    input: {
      height: 60,
      borderRadius: 18,
      backgroundColor:
        "rgba(255,255,255,0.04)",
      paddingHorizontal: 18,
      color: "white",
      fontSize: 16,
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.05)",
    },

    button: {
      marginTop: 10,
      height: 62,
      borderRadius: 20,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },

    buttonText: {
      color: "#111",
      fontSize: 17,
      fontWeight: "800",
      letterSpacing: 0.3,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 26,
    },

    footerText: {
      color: "#9ca3af",
      fontSize: 15,
    },

    signup: {
      color: "white",
      fontSize: 15,
      fontWeight: "700",
    },
  });