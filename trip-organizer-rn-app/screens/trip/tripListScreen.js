import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import Card from "../../components/technical/Card";
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
const signInScreen = () => {
  return (
    <FlatList
      bounces={false}
      data={cards}
      renderItem={({ index, item: { type } }) => (
        <Card style={styles.cartItem}>
          <Text style={styles.title}>Wyjazd po sesji </Text>
          <Text style={styles.dateText}>03.04.2020 - 07.04.2020</Text>
          <Text style={styles.destination}>Mediolan</Text>
        </Card>
      )}
      keyExtractor={(item) => item.index}
    />
  );
};

signInScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Trips",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-add"
          onPress={() => {
            navData.navigation.navigate("TripDestination");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
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
  dateText: {
    fontSize: 17,
    letterSpacing: 1,
    padding: 5,
  },
  destination: {
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "bold",
    paddingLeft: 5,
  },
});

export default signInScreen;
