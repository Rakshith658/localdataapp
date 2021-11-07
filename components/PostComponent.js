import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import * as firestorage from "firebase";
import "firebase/firestore";
import { useSelector } from "react-redux";

const profile = require("../assets/profilepic.png");

const PostComponent = ({ item }) => {
  const currentUserinfo = useSelector((state) => state.Info.auth);

  const [color, setcolor] = useState("black");
  const [isliked, setisliked] = useState(null);
  var db = firestorage.firestore();
  const getpost = () => {
    var docRef = db.collection("posts").doc(item.postid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const a = doc.data();
          const b = a.likes.find((e) => e === currentUserinfo?.uid);
          if (b === undefined) {
            setisliked(false);
          } else {
            setisliked(true);
          }
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  const likePost = () => {
    if (isliked) {
      item.likes.pop(currentUserinfo?.uid);
    } else {
      item.likes.push(currentUserinfo?.uid);
    }
    db.collection("posts")
      .doc(item.postid)
      .set({
        ...item,
      })
      .then(() => {
        setisliked(!isliked);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  useEffect(() => {
    getpost();
  }, []);

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
          color={isliked ? "blue" : "black"}
          onPress={likePost}
        />
        <FontAwesome5 name="comments" size={24} color="black" />
      </View>
    </View>
  );
};

export default PostComponent;

const styles = StyleSheet.create({
  postContainer: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
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
