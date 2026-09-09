import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import axios from "axios";

import useAuthStore from "../../store/authStore";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  const [name, setName] =
    useState(user?.name || "");

  const [email, setEmail] =
    useState(user?.email || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const [vehicle, setVehicle] =
    useState(
      user?.vehicle_number || ""
    );

  const [loading, setLoading] =
    useState(false);

  const updateProfile =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.put(
            `${API_URL}/api/drivers/update-profile/${user.id}`,
            {
              name,
              email,
              phone,
              vehicle_number:
                vehicle,
            }
          );

        setUser(
          response.data.driver
        );

        Alert.alert(
          "Success",
          "Profile updated successfully"
        );

      } catch (error) {

        console.log(error);

        Alert.alert(
          "Error",
          "Failed to update profile"
        );

      } finally {

        setLoading(false);
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

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={false}
    >

      <StatusBar
        barStyle="light-content"
      />

      {/* TOP SECTION */}

      <View style={styles.topSection}>

        <View style={styles.profileWrapper}>

          <View style={styles.imageContainer}>

            <Image
              source={require("../../assets/icons/profile.png")}
              style={styles.profileImage}
            />

          </View>

          <Text style={styles.name}>
            {name || "Driver"}
          </Text>

          <Text style={styles.subText}>
            Professional Driver
          </Text>

        </View>

      </View>

      {/* INFO CARDS */}

      <View style={styles.infoContainer}>

        <View style={styles.infoCard}>

          <Text style={styles.infoValue}>
            {vehicle || "N/A"}
          </Text>

          <Text style={styles.infoLabel}>
            Vehicle Number
          </Text>

        </View>

        <View style={styles.infoCard}>

          <Text style={styles.infoValue}>
            Active
          </Text>

          <Text style={styles.infoLabel}>
            Status
          </Text>

        </View>

      </View>

      {/* FORM SECTION */}

      <View style={styles.formSection}>

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        {/* NAME */}

        <View style={styles.inputCard}>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            placeholderTextColor="#999"
            style={styles.input}
          />

        </View>

        {/* EMAIL */}

        <View style={styles.inputCard}>

          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            style={styles.input}
          />

        </View>

        {/* PHONE */}

        <View style={styles.inputCard}>

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            style={styles.input}
          />

        </View>

        {/* VEHICLE */}

        <View style={styles.inputCard}>

          <Text style={styles.label}>
            Vehicle Number
          </Text>

          <TextInput
            value={vehicle}
            onChangeText={setVehicle}
            placeholder="Enter vehicle number"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            style={styles.input}
          />

        </View>

        {/* SAVE BUTTON */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateProfile}
          disabled={loading}
        >

          {
            loading ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text style={styles.saveText}>
                Save Changes
              </Text>
            )
          }

        </TouchableOpacity>

        {/* LOGOUT BUTTON */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  topSection: {
    backgroundColor: "#111",
    paddingTop: 70,
    paddingBottom: 90,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  profileWrapper: {
    alignItems: "center",
  },

  imageContainer: {
    width: 130,
    height: 130,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.15)",
  },

  profileImage: {
    width: 70,
    height: 70,
    tintColor: "white",
    resizeMode: "contain",
  },

  name: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },

  subText: {
    marginTop: 6,
    fontSize: 15,
    color: "#cfcfcf",
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: -45,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 6,
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },

  infoLabel: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },

  formSection: {
    marginTop: 28,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
  },

  inputCard: {
    backgroundColor: "white",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },

  input: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },

  saveButton: {
    backgroundColor: "#111",
    height: 62,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
    elevation: 5,
  },

  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  logoutButton: {

  marginTop: 16,

  backgroundColor: "#fff0f0",

  borderWidth: 1,

  borderColor: "#ffdddd",

  paddingVertical: 18,

  borderRadius: 22,

  alignItems: "center",
},

logoutText: {

  color: "#ff3b30",

  fontSize: 17,

  fontWeight: "bold",
},
});