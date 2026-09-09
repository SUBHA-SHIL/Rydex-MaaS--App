import socket from "../../hooks/useSocket";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import axios from "axios";

import {
  useLocalSearchParams,
} from "expo-router";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

export default function ChatRoom() {

  const params =
    useLocalSearchParams();

  const ride =
    JSON.parse(params.ride);

  const rideId =
    ride.id;

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [user, setUser] =
    useState(null);

  const flatListRef =
    useRef(null);

  useEffect(() => {

    loadUser();

    fetchMessages();

    socket.emit(
      "joinRideRoom",
      rideId
    );

    socket.on(
      "receiveMessage",
      (message) => {

        if (
          message.ride_id === rideId
        ) {

          setMessages(
            (prev) => [
              ...prev,
              message,
            ]
          );
        }
      }
    );

    return () => {

      socket.off(
        "receiveMessage"
      );
    };

  }, []);

  const loadUser =
    async () => {

      const storedUser =
        JSON.parse(
          await AsyncStorage.getItem(
            "user"
          )
        );

      setUser(storedUser);
    };

  const fetchMessages =
    async () => {

      try {

        const response =
          await axios.get(
            `${API_URL}/api/chat/${rideId}`
          );

        setMessages(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  const sendMessage =
    async () => {

      try {

        if (!text.trim()) {
          return;
        }

        const response =
          await axios.post(
            `${API_URL}/api/chat/send`,
            {
              ride_id: rideId,

              sender_id:
                user.id,

              receiver_id:
                ride.driver_id,

              message: text,
            }
          );

        socket.emit(
          "sendMessage",
          response.data.data
        );

        setText("");

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <KeyboardAvoidingView

      style={styles.container}

      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <FlatList

        ref={flatListRef}

        data={messages}

        keyExtractor={(item) =>
          item.id.toString()
        }

        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({
            animated: true,
          })
        }

        contentContainerStyle={{
          padding: 20,
        }}

        renderItem={({ item }) => (

          <View
            style={[

              styles.messageWrapper,

              item.sender_id ===
                user?.id

                ? styles.myMessageWrapper

                : styles.otherMessageWrapper,
            ]}
          >

            <View
              style={[

                styles.message,

                item.sender_id ===
                  user?.id

                  ? styles.myMessage

                  : styles.otherMessage,
              ]}
            >

              <Text
                style={styles.sender}
              >
                {item.sender_name}
              </Text>

              <Text
                style={[
                  styles.text,

                  item.sender_id ===
                    user?.id && {
                      color: "white",
                    },
                ]}
              >
                {item.message}
              </Text>

              <Text
                style={[
                  styles.time,

                  item.sender_id ===
                    user?.id && {
                      color: "#ddd",
                    },
                ]}
              >

                {
                  new Date(
                    item.created_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }

              </Text>

            </View>

          </View>
        )}
      />

      <View style={styles.inputContainer}>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type message..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >

          <Text style={styles.sendText}>
            Send
          </Text>

        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#fff",
    },

    messageWrapper: {
      marginBottom: 14,
      flexDirection: "row",
    },

    myMessageWrapper: {
      justifyContent: "flex-end",
    },

    otherMessageWrapper: {
      justifyContent: "flex-start",
    },

    message: {
      maxWidth: "80%",
      padding: 14,
      borderRadius: 18,
    },

    myMessage: {
      backgroundColor: "#111",
    },

    otherMessage: {
      backgroundColor: "#f1f1f1",
    },

    sender: {
      fontWeight: "bold",
      marginBottom: 6,
    },

    text: {
      fontSize: 15,
      color: "#111",
    },

    time: {
      marginTop: 8,
      fontSize: 11,
      color: "#777",
    },

    inputContainer: {
      flexDirection: "row",
      padding: 15,
      borderTopWidth: 1,
      borderColor: "#eee",
      backgroundColor: "white",
    },

    input: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      borderRadius: 18,
      paddingHorizontal: 18,
      fontSize: 15,
    },

    sendButton: {
      marginLeft: 10,
      backgroundColor: "#111",
      borderRadius: 18,
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
    },

    sendText: {
      color: "white",
      fontWeight: "bold",
    },
  });