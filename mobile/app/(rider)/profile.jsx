import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import {
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import {
  router,
} from "expo-router";

import useAuthStore from "../../store/authStore";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const [name, setName] =
    useState(
      user?.name || ""
    );

  const [email, setEmail] =
    useState(
      user?.email || ""
    );

  const [phone, setPhone] =
    useState(
      user?.phone || ""
    );

  const [loading, setLoading] =
    useState(false);

  const saveProfile =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.put(
            `${API_URL}/api/auth/profile/${user.id}`,
            {
              name,
              email,
              phone,
            }
          );

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        setUser(
          response.data.user
        );

        alert(
          "Profile Updated Successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
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

        {/* TOP SECTION */}

        <View style={styles.topSection}>

          <Text style={styles.smallText}>
            Account Settings
          </Text>

          <Text style={styles.mainTitle}>
            My Profile
          </Text>

          {/* PROFILE CARD */}

          <View style={styles.profileCard}>

            <View style={styles.imageWrapper}>

              <Image
                source={require("../../assets/icons/profile.png")}
                style={styles.profileImage}
              />

            </View>

            <Text style={styles.userName}>
              {name}
            </Text>

            <Text style={styles.userEmail}>
              {email}
            </Text>

            <View style={styles.memberBadge}>

              <Text style={styles.memberText}>
                Rydex Rider
              </Text>

            </View>

          </View>

        </View>

        {/* FORM */}

        <View style={styles.formContainer}>

          {/* NAME */}

          <Text style={styles.label}>
            Full Name
          </Text>

          <View style={styles.inputContainer}>

            <Image
              source={require("../../assets/icons/profile.png")}
              style={styles.inputIcon}
            />

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              style={styles.input}
            />

          </View>

          {/* EMAIL */}

          <Text style={styles.label}>
            Email Address
          </Text>

          <View style={styles.inputContainer}>

            <Image
              source={require("../../assets/icons/chat.png")}
              style={styles.inputIcon}
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="#999"
              style={styles.input}
            />

          </View>

          {/* PHONE */}

          <Text style={styles.label}>
            Phone Number
          </Text>

          <View style={styles.inputContainer}>

            <Image
              source={require("../../assets/icons/home.png")}
              style={styles.inputIcon}
            />

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              style={styles.input}
            />

          </View>

          {/* SAVE BUTTON */}

          <TouchableOpacity

            style={styles.saveButton}

            onPress={saveProfile}

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

          {/* LOGOUT */}

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

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#f4f4f4",
    },

    topSection: {
      backgroundColor: "black",
      paddingTop: 65,
      paddingBottom: 110,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      paddingHorizontal: 20,
    },

    smallText: {
      color: "#aaa",
      fontSize: 15,
    },

    mainTitle: {
      color: "white",
      fontSize: 34,
      fontWeight: "bold",
      marginTop: 5,
    },

    profileCard: {
      backgroundColor: "white",
      borderRadius: 30,
      paddingVertical: 35,
      alignItems: "center",
      marginTop: 35,
      elevation: 6,
    },

    imageWrapper: {
      width: 120,
      height: 120,
      borderRadius: 100,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
    },

    profileImage: {
      width: 65,
      height: 65,
      resizeMode: "contain",
      tintColor: "black",
    },

    userName: {
      fontSize: 28,
      fontWeight: "bold",
      marginTop: 18,
      color: "#111",
    },

    userEmail: {
      color: "gray",
      marginTop: 6,
      fontSize: 15,
    },

    memberBadge: {
      backgroundColor: "#f3f3f3",
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 100,
      marginTop: 18,
    },

    memberText: {
      color: "#111",
      fontWeight: "600",
    },

    formContainer: {
      marginTop: -70,
      backgroundColor: "#f4f4f4",
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      paddingTop: 35,
      paddingHorizontal: 20,
    },

    label: {
      fontSize: 15,
      fontWeight: "700",
      color: "#111",
      marginBottom: 12,
      marginTop: 18,
    },

    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 20,
      paddingHorizontal: 18,
      height: 62,
      elevation: 3,
    },

    inputIcon: {
      width: 22,
      height: 22,
      resizeMode: "contain",
      tintColor: "#666",
      marginRight: 14,
    },

    input: {
      flex: 1,
      fontSize: 16,
      color: "#111",
    },

    saveButton: {
      backgroundColor: "black",
      height: 62,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 35,
      elevation: 4,
    },

    saveText: {
      color: "white",
      fontSize: 17,
      fontWeight: "bold",
    },

    logoutButton: {
      height: 62,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 18,
      backgroundColor: "#ffeaea",
      marginBottom: 30,
    },

    logoutText: {
      color: "#ff2d2d",
      fontSize: 17,
      fontWeight: "bold",
    },
  });