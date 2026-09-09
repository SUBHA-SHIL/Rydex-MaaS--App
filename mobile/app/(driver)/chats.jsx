import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

export default function Chats() {

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  return (

    <View style={styles.container}>

      <TouchableOpacity

        style={styles.chatCard}

        onPress={() =>

          router.push({
            pathname:
              "/(driver)/chat-room",

            params: {
              ride:
                JSON.stringify(ride),
            },
          })
        }
      >

        <Text style={styles.name}>
          Rider Chat
        </Text>

        <Text style={styles.message}>
          Open conversation
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: "#fff",
    },

    chatCard: {
      backgroundColor: "#f5f5f5",
      padding: 22,
      borderRadius: 22,
    },

    name: {
      fontSize: 20,
      fontWeight: "bold",
    },

    message: {
      marginTop: 6,
      color: "gray",
    },
  });