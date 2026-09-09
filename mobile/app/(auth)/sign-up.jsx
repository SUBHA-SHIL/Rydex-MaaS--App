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
  ScrollView,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../../lib/api";

import useAuthStore from "../../store/authStore";

const { width } =
  Dimensions.get("window");

export default function SignUp() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [role, setRole] =
    useState("RIDER");

  const [loading, setLoading] =
    useState(false);

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );

  const handleSignup =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.post(
            "/api/auth/signup",
            {
              name,
              email,
              password,
              role,
              phone,
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
          "Account created successfully"
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

    <ScrollView
      contentContainerStyle={
        styles.scrollContainer
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      <StatusBar
        barStyle="light-content"
      />

      {/* BACKGROUND */}

      <View style={styles.circleOne} />

      <View style={styles.circleTwo} />

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join Rydex and experience
          modern real-time ride booking.
        </Text>

      </View>

      {/* FORM CARD */}

      <View style={styles.card}>

        {/* NAME */}

        <View style={styles.inputWrapper}>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

        </View>

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

        {/* PHONE */}

        <View style={styles.inputWrapper}>

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#6b7280"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

        </View>

        {/* PASSWORD */}

        <View style={styles.inputWrapper}>

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            placeholder="Create password"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

        </View>

        {/* ROLE */}

        <Text style={styles.roleTitle}>
          Select Role
        </Text>

        <View style={styles.roleContainer}>

          {/* RIDER */}

          <TouchableOpacity

            activeOpacity={0.85}

            onPress={() =>
              setRole("RIDER")
            }

            style={[

              styles.roleButton,

              role === "RIDER" &&
              styles.activeRole,
            ]}
          >

            <Text
              style={[

                styles.roleText,

                role === "RIDER" &&
                styles.activeRoleText,
              ]}
            >
              Rider
            </Text>

          </TouchableOpacity>

          {/* DRIVER */}

          <TouchableOpacity

            activeOpacity={0.85}

            onPress={() =>
              setRole("DRIVER")
            }

            style={[

              styles.roleButton,

              role === "DRIVER" &&
              styles.activeRole,
            ]}
          >

            <Text
              style={[

                styles.roleText,

                role === "DRIVER" &&
                styles.activeRoleText,
              ]}
            >
              Driver
            </Text>

          </TouchableOpacity>

        </View>

        {/* BUTTON */}

        <TouchableOpacity

          activeOpacity={0.85}

          onPress={handleSignup}

          disabled={loading}

          style={styles.button}
        >

          <Text style={styles.buttonText}>

            {
              loading
                ? "Creating..."
                : "Create Account"
            }

          </Text>

        </TouchableOpacity>

        {/* FOOTER */}

        <TouchableOpacity

          style={styles.footer}

          onPress={() =>
            router.push(
              "/(auth)/sign-in"
            )
          }
        >

          <Text style={styles.footerText}>
            Already have an account?
          </Text>

          <Text style={styles.signin}>
            {" "}Sign In
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles =
  StyleSheet.create({

    scrollContainer: {
      flexGrow: 1,
      backgroundColor: "#0f0f10",
      paddingHorizontal: 24,
      paddingTop: 90,
      paddingBottom: 40,
    },

    circleOne: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: 320,
      backgroundColor: "#1f2937",
      top: -120,
      right: -120,
      opacity: 0.5,
    },

    circleTwo: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 240,
      backgroundColor: "#111827",
      bottom: -80,
      left: -80,
      opacity: 0.7,
    },

    header: {
      marginBottom: 36,
    },

    title: {
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
      width: width * 0.8,
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
      marginBottom: 20,
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

    roleTitle: {
      color: "#d1d5db",
      marginBottom: 14,
      marginTop: 5,
      fontSize: 14,
      fontWeight: "700",
    },

    roleContainer: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 28,
    },

    roleButton: {
      flex: 1,
      height: 58,
      borderRadius: 18,
      backgroundColor:
        "rgba(255,255,255,0.04)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.05)",
    },

    activeRole: {
      backgroundColor: "white",
    },

    roleText: {
      color: "#9ca3af",
      fontSize: 16,
      fontWeight: "700",
    },

    activeRoleText: {
      color: "#111",
    },

    button: {
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
      justifyContent: "start",
      marginTop: 26,
    },

    footerText: {
      color: "#9ca3af",
      fontSize: 15,
    },

    signin: {
      color: "white",
      fontSize: 15,
      fontWeight: "700",
    },
  });