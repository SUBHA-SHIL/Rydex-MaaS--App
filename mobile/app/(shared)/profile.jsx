import { View, Text, TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import useAuthStore from "../../store/authStore";

export default function Profile() {
  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();

    logout();

    router.replace("/(auth)/welcome");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        Profile
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "red",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}