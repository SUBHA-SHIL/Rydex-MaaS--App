import {
  Tabs,
} from "expo-router";

import {
  View,
  Image,
  StyleSheet,
} from "react-native";

export default function DriverLayout() {

  return (


    <Tabs

      screenOptions={{

        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: styles.tabBar,
      }}
    >

      {/* HIDDEN SCREENS */}

      <Tabs.Screen
        name="active-ride"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="chat-room"
        options={{
          href: null,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          href: null,
        }}
      />

      {/* HOME */}

      <Tabs.Screen

        name="dashboard"

        options={{

          tabBarIcon: ({
            focused,
          }) => (

            <View
              style={[
                styles.iconWrapper,

                focused &&
                styles.activeTab,
              ]}
            >

              <Image
                source={require("../../assets/icons/home.png")}
                style={[
                  styles.icon,
                  {
                    tintColor:
                      focused
                        ? "white"
                        : "#888",
                  },
                ]}
              />

            </View>
          ),
        }}
      />

      {/* HISTORY */}

      <Tabs.Screen

        name="history"

        options={{

          tabBarIcon: ({
            focused,
          }) => (

            <View
              style={[
                styles.iconWrapper,

                focused &&
                styles.activeTab,
              ]}
            >

              <Image
                source={require("../../assets/icons/list.png")}
                style={[
                  styles.icon,
                  {
                    tintColor:
                      focused
                        ? "white"
                        : "#888",
                  },
                ]}
              />

            </View>
          ),
        }}
      />

      {/* CHATS */}

      {/* PROFILE */}

      <Tabs.Screen

        name="profile"

        options={{

          tabBarIcon: ({
            focused,
          }) => (

            <View
              style={[
                styles.iconWrapper,

                focused &&
                styles.activeTab,
              ]}
            >

              <Image
                source={require("../../assets/icons/profile.png")}
                style={[
                  styles.icon,

                  {
                    tintColor:
                      focused
                        ? "white"
                        : "#888",
                  },
                ]}
              />

            </View>
          ),
        }}
      />

    </Tabs>
  );
}

const styles =
  StyleSheet.create({

    tabBar: {

      position: "absolute",

      bottom: 25,

      left: 20,

      right: 20,

      height: 65,

      backgroundColor: "black",

      borderRadius: 24,

      borderTopWidth: 0,

      elevation: 10,

      paddingTop: 10,
      marginHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },

    iconWrapper: {

      width: 52,

      height: 52,

      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center'
    },

    activeTab: {
      backgroundColor: "#222",
    },

    icon: {

      width: 24,

      height: 24,

      resizeMode: "contain",
    },
  });