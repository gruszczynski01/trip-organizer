import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Card from "./Card";

const MenuTile = (props) => {
  return (
    // <View style={styles.card}>
    //   <TouchableOpacity>
    <Card style={styles.cartItem}>
      <Text>{props.title}</Text>
    </Card>
    //   </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "80%",
  },
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    minHeight: "50",
    width: "80%",
    flex: 1,
    // width:,
    // flexDirection: "row",
    // justifyContent: "flex-start",
    // marginHorizontal: 20,
    // marginTop: 30,
    // minHeight: 120,
    // flex: 1,
    // flexDirection: "column",
  },
});

export default MenuTile;
