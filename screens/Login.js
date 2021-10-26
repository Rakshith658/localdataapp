import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { firebase } from "@firebase/app";

import "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [passwordguide, setPasswordguide] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isloding, setisloding] = useState(true);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("home");
      } else {
        setisloding(false);
      }
    });

    return unsubscribe;
  }, []);
  const SaveData = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        (error) => alert(error);
      });
  };
  if (isloding) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <ActivityIndicator size='large'/> */}
        <ActivityIndicator size="large" color="#2C6BED" />
        <Text style={{ marginTop: 20 }}>Loading....</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.Card}>
        <Text style={styles.maintitle}>Login</Text>
        <Text style={styles.title}>E-Mail</Text>
        <TextInput
          style={styles.Input}
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setemail(e)}
        />
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.Input}
          secureTextEntry
          onFocus={() => setPasswordguide(true)}
          value={password}
          onChangeText={(e) => setpassword(e)}
        />
        {passwordguide && (
          <Text style={styles.passwordguide}>
            password must be at least 6 characters
          </Text>
        )}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Login"
              color="green"
              disabled={email && password ? false : true}
              onPress={SaveData}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Register"
              onPress={() => navigation.replace("register")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
  },
  Card: {
    margin: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  maintitle: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  Input: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 5,
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginVertical: 15,
    marginHorizontal: 30,
    padding: 10,
    justifyContent: "space-evenly",
  },
  button: {
    marginVertical: 10,
  },
  passwordguide: {
    marginHorizontal: 10,
    marginTop: 5,
    color: "red",
    fontSize: 12,
  },
});
