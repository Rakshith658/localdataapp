import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const profile = require("../assets/profilepic.png");

const PostComponent = ({ item }) => {
  const [color, setcolor] = useState("black");
  return (
    <View style={styles.postContainer}>
      <View style={styles.Info}>
        <Image
          style={styles.image}
          source={item.profile ? { uri: item.profile } : profile}
        />
        <Text style={styles.Name}>{item.name}</Text>
      </View>
      <View style={styles.Details}>
        <Text style={styles.desc}>{item.desc}</Text>
        {item.image && (
          <Image style={styles.post} source={{ uri: item.image }} />
        )}
      </View>
      <View style={styles.iconContainer}>
        <AntDesign
          name="like2"
          size={24}
          color={color}
          onPress={() => setcolor("blue")}
        />
        <FontAwesome5 name="comments" size={24} color="black" />
      </View>
    </View>
  );
};

export default PostComponent;

const styles = StyleSheet.create({
  postContainer: {
    elevation: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  Info: {
    flexDirection: "row",
    margin: 5,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 15,
  },
  Name: {
    alignSelf: "center",
    marginLeft: 5,
    fontSize: 17,
  },
  Details: {
    margin: 5,
  },
  desc: {
    padding: 5,
    fontSize: 14,
  },
  post: {
    width: "80%",
    height: 150,
    alignSelf: "center",
    margin: 5,
    borderRadius: 10,
  },
  iconContainer: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
