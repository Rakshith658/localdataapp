import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import NotificationComponents from "../components/NotificationComponents";
import Data from "../data/data";

const NotificationScreen = () => {
  return (
    <FlatList
      data={Data}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <NotificationComponents item={item.item} />}
    />
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
