import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { firebase } from "@firebase/app";
import * as ImagePicker from "expo-image-picker";
import "firebase/auth";
import * as firestorage from "firebase";
import "firebase/storage";
import "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { currentUser } from "../store/action";
import PostComponent from "../components/PostComponent";
const profile = require("../assets/profilepic.png");

const ProfileScreen = () => {
  //   const [UserData, setUserData] = useState({});
  const currentUserinfo = useSelector((state) => state.Info.auth);
  const [isEditable, setisEditable] = useState(false);
  const [imageUpload, setimageUpload] = useState(false);
  const [ImageUrl, setImageUrl] = useState(currentUserinfo?.photoURL);
  const [Name, setName] = useState(currentUserinfo?.displayName);
  const [email, setemail] = useState(currentUserinfo?.email);
  const [isloding, setisloding] = useState(false);
  const [Data, setData] = useState([]);

  const dispatch = useDispatch();
  var db = firestorage.firestore();

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImageUrl(result.uri);
      setimageUpload(true);
    }
  };
  const getposts = async () => {
    await db.collection("posts").onSnapshot((snapshot) => {
      let a = snapshot.docs.map((d) => d.data());
      let b = a.filter((d) => d.useruid === currentUserinfo?.uid);
      setData(b);
    });
  };
  const upload = async () => {
    const response = await fetch(ImageUrl);
    const blob = await response.blob();
    var ref = await firestorage.storage().ref().child(email);
    return ref.put(blob);
  };
  const save = async () => {
    setisloding(true);
    if (imageUpload) {
      await upload();
    }
    var ref = await firebase
      .storage()
      .ref()
      .child(imageUpload ? email : currentUserinfo?.email);
    const url = await ref.getDownloadURL();
    setImageUrl(url);
    const userinf = await firebase.auth().currentUser;
    await userinf
      .updateProfile({
        displayName: Name,
        photoURL: url,
      })
      .then(() => {
        console.warn("auth successfull");
      })
      .catch((e) => {
        console.log(e);
      });
    if (currentUserinfo?.email != email) {
      await userinf
        .updateEmail(email)
        .then(() => {
          console.warn("email updated successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    const userinfo = await firebase.auth();
    dispatch(currentUser(userinfo.currentUser.providerData[0]));
    setisloding(false);
    setisEditable(!isEditable);
  };
  useEffect(() => {
    getposts();
  }, []);
  if (Data.length >= 1) {
    return (
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            {isEditable ? (
              <View style={styles.editecontainer}>
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
                      style={styles.imageEdite}
                    />

                    <Entypo
                      name="pencil"
                      size={28}
                      color="white"
                      style={styles.icon}
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
                  <Text style={styles.title}>E-Mail</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(e) => setemail(e)}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.Info}>
                <Image style={styles.image} source={{ uri: ImageUrl }} />
                <View style={styles.InfoContainer}>
                  <Text style={styles.title}>Name : {Name}</Text>
                  <Text style={styles.title}>E-mail : {email}</Text>
                </View>
              </View>
            )}
            <View style={styles.buttonContainerleft}>
              <Button
                title={isEditable ? "Cancel" : "Refresh"}
                color="gray"
                onPress={
                  isEditable ? () => setisEditable(!isEditable) : getposts
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={isEditable ? "Save" : "Edite"}
                color="green"
                disabled={isloding ? true : false}
                onPress={isEditable ? save : () => setisEditable(!isEditable)}
              />
            </View>
          </View>
        }
        data={Data}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <PostComponent item={item.item} />}
      />
    );
  }
  return (
    <View style={styles.container}>
      {isEditable ? (
        <View style={styles.editecontainer}>
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
                style={styles.imageEdite}
              />

              <Entypo
                name="pencil"
                size={28}
                color="white"
                style={styles.icon}
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
            <Text style={styles.title}>E-Mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(e) => setemail(e)}
            />
          </View>
        </View>
      ) : (
        <View style={styles.Info}>
          <Image style={styles.image} source={{ uri: ImageUrl }} />
          <View style={styles.InfoContainer}>
            <Text style={styles.title}>Name : {Name}</Text>
            <Text style={styles.title}>E-mail : {email}</Text>
          </View>
        </View>
      )}
      <View style={styles.buttonContainerleft}>
        <Button
          title={isEditable ? "Cancel" : "Refresh"}
          color="gray"
          onPress={isEditable ? () => setisEditable(!isEditable) : getposts}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isEditable ? "Save" : "Edite"}
          color="green"
          disabled={isloding ? true : false}
          onPress={isEditable ? save : () => setisEditable(!isEditable)}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editecontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  imagecontainer: {
    borderRadius: 50,
  },
  imageEdite: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "black",
  },
  icon: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  formcontrole: {
    width: "80%",
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  Info: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  InfoContainer: {
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 10,
    top: 20,
    right: 20,
  },
  buttonContainerleft: {
    position: "absolute",
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 10,
    top: 20,
    left: 20,
  },
});
