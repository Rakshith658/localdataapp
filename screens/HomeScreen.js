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
import PostComponent from "../components/PostComponent";
import { firebase } from "@firebase/app";
import * as firestorage from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../store/action";

const profile = require("../assets/profilepic.png");

const HomeScreen = ({ navigation }) => {
  const [postImage, setpostImage] = useState(null);
  const [desc, setdesc] = useState("");
  const [imageUpload, setimageUpload] = useState(false);
  const [isposting, setIsposting] = useState(false);
  const [Data, setData] = useState([]);
  const [refreshing, setrefreshing] = useState(false);

  const dispatch = useDispatch();

  let url;
  let postuid;

  var db = firestorage.firestore();
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
      setimageUpload(true);
    }
  };

  const postIt = async () => {
    postuid =
      currentUserinfo?.uid + new Date().getTime().toString() + "file.png";

    setIsposting(true);
    const upload = async () => {
      const response = await fetch(postImage);
      const blob = await response.blob();
      var ref = await firestorage.storage().ref().child(postuid);
      return ref.put(blob);
    };
    if (imageUpload) {
      await upload();
      const ref = await firebase.storage().ref().child(postuid);
      url = await ref.getDownloadURL();
      setpostImage(null);
    }
    db.collection("posts")
      .add({
        id: new Date().getTime().toString(),
        profile: currentUserinfo?.photoURL,
        name: currentUserinfo?.displayName,
        desc: desc,
        image: imageUpload ? url : null,
        useruid: currentUserinfo?.uid,
        likes: [],
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    setdesc("");
    setIsposting(false);
  };
  const getposts = () => {
    db.collection("posts").onSnapshot((snapshot) => {
      let a = snapshot.docs.map((d) => {
        let a = {};
        a = d.data();
        a.postid = d.id;
        return a;
      });
      setData(a);
    });
  };
  useEffect(() => {
    setTimeout(() => {
      getUserData();
    }, 1000);
    getposts();
  }, []);
  if (Data.length >= 1) {
    return (
      <View style={styles.container}>
        <FlatList
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
                {isposting ? null : (
                  <Button
                    title="Post"
                    color="green"
                    onPress={postIt}
                    disabled={desc ? false : true}
                  />
                )}
              </View>
            </View>
          }
          data={Data.sort((a, b) => {
            return b.id - a.id;
          })}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <PostComponent item={item.item} />}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
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
          {isposting ? null : (
            <Button
              title="Post"
              color="green"
              onPress={postIt}
              disabled={desc ? false : true}
            />
          )}
        </View>
      </View>
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
