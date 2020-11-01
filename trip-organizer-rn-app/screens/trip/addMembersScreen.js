import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/technical/HeaderButton";

const cards = [
  {
    type: "card - 1",
  },
  {
    type: "card - 2",
  },
  {
    type: "card - 3",
  },
  {
    type: "card - 4",
  },
  {
    type: "card - 5",
  },
  {
    type: "card - 6",
  },
  {
    type: "card - 7",
  },
  {
    type: "card - 8",
  },
  {
    type: "card - 9",
  },
  {
    type: "card - 10",
  },
  {
    type: "card - 12",
  },
  {
    type: "card - 13",
  },
  {
    type: "card - 14",
  },
  {
    type: "card - 15",
  },
  {
    type: "card - 16",
  },
  {
    type: "card - 17",
  },
  {
    type: "card - 18",
  },
  {
    type: "card - 19",
  },
];
const inputChangeHandler = () => {
  console.log("Click...click");
};
const nextHandler = () => {
  console.log("Click...click");
};

const addMembersScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.mainTitle}>Who are you going with?</Text>
      <Card style={styles.input}>
        <ScrollView>
          <Input
            id="name"
            label="Name"
            required
            autoCapitalize="none"
            errorText="Please enter a valid name."
            onInputChange={inputChangeHandler}
            initialValue=""
          />
          <View style={styles.buttonContainer}>
            <Button title="Next" onPress={nextHandler} />
          </View>
        </ScrollView>
      </Card>
      <FlatList
        bounces={false}
        data={cards}
        renderItem={({ index, item: { type } }) => (
          <Card style={styles.cartItem}>
            <Text style={styles.title}>Szymon Gruszczynski</Text>
            <Text style={styles.emailText}>gruszczynski01@gmail.com</Text>
          </Card>
        )}
        keyExtractor={(item) => item.index}
      />
    </View>
  );
};

addMembersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Select time period",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName="ios-save"
          onPress={() => {
            navData.navigation.navigate("TripList");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
  },
  subtitle: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 30,
  },
  input: {
    width: "80%",
    // maxWidth: 400,
    // maxHeight: 400,
    // paddingHorizontal: 20,
    // paddingVertical: 5,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  container: { flex: 1 },
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    // flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 20,
    marginTop: 30,
    minHeight: 120,
    flex: 1,
    flexDirection: "column",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 27,
    fontWeight: "bold",
    letterSpacing: 1,
    padding: 5,
  },
  emailText: {
    fontSize: 17,
    letterSpacing: 1,
    padding: 5,
  },
  // destination: {
  //   fontSize: 17,
  //   letterSpacing: 1,
  //   fontWeight: "bold",
  //   paddingLeft: 5,
  // },
});

export default addMembersScreen;
