import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const profile = require("../assets/profilepic.png");

const NotificationComponents = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileimageContainer}>
        <Image
          style={styles.profileimage}
          source={item.profile ? { uri: item.profile } : profile}
        />
      </View>
      <View style={styles.TextContainer}>
        <View style={styles.TextInfo}>
          <Text style={styles.TextName}>{item.name}</Text>
          <Text style={styles.Text} numberOfLines={2}>
            and 45 people liked your post
          </Text>
        </View>
        <View style={styles.time}>
          <Text style={styles.Texttime}>3 mins ago</Text>
        </View>
      </View>
      <View style={styles.postimageContainer}>
        <Image style={styles.postimage} source={{ uri: item.image }} />
      </View>
    </View>
  );
};

export default NotificationComponents;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileimageContainer: {
    margin: 10,
    alignSelf: "center",
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  TextContainer: {
    alignSelf: "center",
  },
  TextInfo: {
    flexDirection: "row",
  },
  TextName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  Text: {
    fontSize: 14,
    marginLeft: 5,
    alignSelf: "center",
  },
  time: {
    flexDirection: "row",
  },
  Texttime: {
    color: "gray",
  },
  postimageContainer: {
    margin: 10,
    alignSelf: "center",
  },
  postimage: {
    width: 50,
    height: 50,
  },
});
