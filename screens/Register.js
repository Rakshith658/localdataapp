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
import { useDispatch, useSelector } from "react-redux";
import { DataRegister } from "../store/action";
const profile = require("../assets/profilepic.png");

const Register = ({ checkAuth }) => {
  const [ImageUrl, setImageUrl] = useState(null);
  const [Name, setName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [aboutyou, setaboutyou] = useState("");
  const auth = useSelector((state) => state.Info.Auth);

  const dispatch = useDispatch();

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

  const saveData = () => {
    const AuthData = { ImageUrl, Name, phoneNumber, aboutyou };
    dispatch(DataRegister(AuthData));
    setImageUrl(null);
    setName("");
    setaboutyou("");
    setphoneNumber("");
    checkAuth();
  };
  return (
    <View style={styles.registercontainer}>
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
        <Text style={styles.title}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={(e) => setphoneNumber(e)}
          keyboardType="numeric"
        />
        <Text style={styles.title}>About you</Text>
        <TextInput
          style={styles.input}
          value={aboutyou}
          onChangeText={(e) => setaboutyou(e)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register" color="green" onPress={saveData} />
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
});
