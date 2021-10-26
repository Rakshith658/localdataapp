import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Register from "../screens/Register";
import HomeScreen from "../screens/HomeScreen";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login";
import TabScreen from "./TabScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

// function getHeaderTitle(route) {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

//   switch (routeName) {
//     case "Home":
//       return "Home";
//     case "Profile":
//       return "My profile";
//     case "Notification":
//       return "Notification";
//   }
// }

const Navigation = () => {
  const auth = useSelector((state) => state.Info.Auth);

  const [Info, setInfo] = useState(null);
  const [isloading, setisloading] = useState(true);

  const checkAuth = async () => {
    const userData = await AsyncStorage.getItem("userData");
    setInfo(userData);
  };

  const getpermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };
  const loading = async () => {
    getpermissions();
    await checkAuth();
    setisloading(false);
  };

  useEffect(() => {
    loading();
  }, [auth]);
  if (isloading) {
    return (
      <View style={styles.container}>
        <Text>Loading.....</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          component={TabScreen}
          // options={({ route }) => ({
          //   headerTitle: getHeaderTitle(route),
          // })}
          // options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="home">
          {(props) => <TabScreen {...props} checkAuth={checkAuth} />}
        </Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
