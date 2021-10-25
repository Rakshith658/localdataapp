import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import { firebase as fireauth } from "@firebase/app";
import "firebase/storage";
import "firebase/auth";
const profile = require("../assets/profilepic.png");

const Register = ({ navigation }) => {
  const [ImageUrl, setImageUrl] = useState(null);
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setpassword] = useState("");
  const [passwordguide, setPasswordguide] = useState(false);

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUrl(result.uri);
    }
  };

  const upload = async () => {
    const response = await fetch(ImageUrl);
    const blob = await response.blob();
    var ref = await firebase.storage().ref().child(email);
    return ref.put(blob);
  };

  const saveData = async () => {
    await upload();
    var ref = await firebase.storage().ref().child(email);
    const url = await ref.getDownloadURL();
    setImageUrl(url);
    await fireauth
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: Name,
          photoURL: url,
          phoneNumber: phoneNumber,
        });
      })
      .catch((error) => alert(error));
    navigation.replace("login");
  };
  return (
    <View style={styles.registercontainer}>
      <View style={styles.Cardcontainer}>
        <Text style={styles.registerText}>Register</Text>
        <TouchableWithoutFeedback onPress={selectImage}>
          <View style={styles.imagecontainer}>
            <Image
              source={
                ImageUrl
                  ? {
                      uri: ImageUrl,
                    }
                  : profile
              }
              style={styles.image}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.formcontrole}>
          <Text style={styles.title}>Name</Text>
          <TextInput
            style={styles.input}
            value={Name}
            onChangeText={(e) => setName(e)}
          />
          <Text style={styles.title}>Phone-Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(e) => setphoneNumber(e)}
            keyboardType="numeric"
          />
          <Text style={styles.title}>E - Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(e) => setemail(e)}
            keyboardType="email-address"
          />
          <Text style={styles.title}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(e) => setpassword(e)}
            secureTextEntry
            onFocus={() => setPasswordguide(true)}
          />
          {passwordguide && (
            <Text style={styles.passwordguide}>
              password must be at least 6 characters
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Register"
              color="green"
              onPress={saveData}
              disabled={
                Name && email && password && ImageUrl && phoneNumber
                  ? false
                  : true
              }
            />
          </View>
          <View style={styles.button}>
            <Button title="login" onPress={() => navigation.replace("login")} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  registercontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Cardcontainer: {
    width: "80%",
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
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: {
    marginVertical: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  imagecontainer: {
    borderRadius: 50,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "black",
  },
  formcontrole: {
    width: "80%",
  },
  title: {
    marginVertical: 8,
    marginTop: 10,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  passwordguide: {
    marginHorizontal: 10,
    marginTop: 5,
    color: "red",
    fontSize: 12,
  },
  button: {
    marginVertical: 10,
  },
});
