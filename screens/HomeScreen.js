import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import data from "../data/data";
import PostComponent from "../components/PostComponent";
import { firebase } from "@firebase/app";

import "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../store/action";

const profile = require("../assets/profilepic.png");

const HomeScreen = ({ navigation }) => {
  const [postImage, setpostImage] = useState(null);
  const [desc, setdesc] = useState("");
  const [Data, setData] = useState(data);
  const [refreshing, setrefreshing] = useState(false);

  const dispatch = useDispatch();

  const currentUserinfo = useSelector((state) => state.Info.auth);

  const getUserData = async () => {
    const userinfo = await firebase.auth();
    dispatch(currentUser(userinfo.currentUser.providerData[0]));
  };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setpostImage(result.uri);
    }
  };

  const postIt = () => {
    // console.log(desc);
    // console.log(typeof desc);
    // console.log(typeof parseInt(desc));
    // const post = {
    //   id: new Date().getTime(),
    //   profile: ImageUrl ? ImageUrl : null,
    //   name: Name,
    //   desc: desc,
    //   image: postImage ? postImage : null,
    // };
    // setData([...Data, post]);
    // setpostImage(null);
    // setdesc("");
  };
  useEffect(() => {
    setTimeout(() => {
      getUserData();
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        // onRefresh={getUserData}
        // refreshing={refreshing}
        ListHeaderComponent={
          <View style={styles.createContainer}>
            <View style={styles.title}>
              <Image
                source={
                  currentUserinfo
                    ? {
                        uri: currentUserinfo.photoURL,
                      }
                    : profile
                }
                style={styles.image}
              />
              <Text style={styles.Name}>{currentUserinfo?.displayName}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="what's on your mind"
                value={desc}
                // keyboardType="numeric"
                // onChange={(e) => setdesc(e.target.value)}
                onChangeText={(e) => setdesc(e)}
              />
              {postImage && (
                <Image
                  source={{
                    uri: postImage,
                  }}
                  style={styles.postimage}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              {!postImage && <Button title="Select" onPress={selectImage} />}
              <Button
                title="Post"
                color="green"
                onPress={postIt}
                // disabled={desc ? false : true}
              />
            </View>
          </View>
        }
        data={Data}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <PostComponent item={item.item} />}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createContainer: {
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
  title: {
    flexDirection: "row",
    margin: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  Name: {
    alignSelf: "center",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "80%",
    alignSelf: "center",
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  postimage: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});
