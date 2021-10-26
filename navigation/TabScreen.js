import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { firebase } from "@firebase/app";

import "firebase/auth";

const Tab = createBottomTabNavigator();
function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return "Home";
    case "Profile":
      return "My profile";
    case "Notification":
      return "Notification";
  }
}

const TabScreen = ({ navigation, route }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(route),
      headerRight:
        getHeaderTitle(route) === "My profile"
          ? () => (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title="logout" iconName="logout" onPress={logout} />
              </HeaderButtons>
            )
          : null,
    });
  }, [navigation, route]);

  const logout = async () => {
    await firebase.auth().signOut();
    navigation.replace("login");
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ios-notifications-circle-outline"
              size={size}
              color={color}
            />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;

const styles = StyleSheet.create({});
