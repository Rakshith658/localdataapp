import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import * as ImagePicker from "expo-image-picker";
import data from "../data/data";
import PostComponent from "../components/PostComponent";

const profile = require("../assets/profilepic.png");

const HomeScreen = ({ checkAuth, navigation }) => {
  const [ImageUrl, setImageUrl] = useState(null);
  const [postImage, setpostImage] = useState(null);
  const [Name, setName] = useState("");
  const [desc, setdesc] = useState("");
  const [Data, setData] = useState(data);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="logout" iconName="logout" onPress={logout} />
        </HeaderButtons>
      ),
    });
  }, [navigation]);
  const logout = async () => {
    await AsyncStorage.removeItem("userData");
    checkAuth();
  };

  const getUserData = async () => {
    const data = await AsyncStorage.getItem("userData");
    const tranformdata = JSON.parse(data);
    setImageUrl(tranformdata.ImageUrl);
    setName(tranformdata.Name);
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
    const post = {
      id: new Date().getTime(),
      profile: ImageUrl ? ImageUrl : null,
      name: Name,
      desc: desc,
      image: postImage ? postImage : null,
    };
    setData([...Data, post]);
    setpostImage(null);
    setdesc("");
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.createContainer}>
            <View style={styles.title}>
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
              <Text style={styles.Name}>{Name}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="what's on your mind"
                value={desc}
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
                disabled={desc ? false : true}
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
