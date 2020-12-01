import React from "react";
import { Text, View, StyleSheet, Button, ImageBackground } from "react-native";
import MenuTile from "../../components/technical/MenuTile";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";

// const image = require("../../assets/images/time_table.jpg");
// const image = { uri: "https://reactjs.org/logo-og.png" };

const mainMenuScreen = (props) => {
  const trip = props.navigation.getParam("trip");

  return (
    <ScrollView style={styles.scrollScreen}>
      <View style={styles.screen}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{trip.name}</Text>
        </View>

        <Animatable.View
          animation="bounceInLeft"
          easing="ease-out"
          iterationCount={1}
        >
          <TouchableOpacity
            style={styles.tileOpacity}
            onPress={() => {
              props.navigation.navigate("TripTimeline", {
                trip: trip,
              });
            }}
          >
            <Card style={styles.tile}>
              <ImageBackground
                style={styles.container}
                source={require("../../assets/images/time_table.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text style={styles.innerText}>TRIP TIMELINE</Text>
              </ImageBackground>
            </Card>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View
          animation="bounceInLeft"
          easing="ease-out"
          iterationCount={1}
        >
          <TouchableOpacity
            style={styles.tileOpacity}
            onPress={() => {
              props.navigation.navigate("ToDoList", {
                trip: trip,
              });
            }}
          >
            <Card style={styles.tile}>
              <ImageBackground
                style={styles.container}
                source={require("../../assets/images/to_do_list.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text style={styles.innerText}>TO DO LIST</Text>
              </ImageBackground>
            </Card>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View
          animation="bounceInLeft"
          easing="ease-out"
          iterationCount={1}
        >
          <TouchableOpacity
            style={styles.tileOpacity}
            onPress={() => {
              props.navigation.navigate("TripMembers", {
                trip: trip,
              });
            }}
          >
            <Card style={styles.tile}>
              <ImageBackground
                style={styles.container}
                source={require("../../assets/images/trip_members.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text style={styles.innerText}>MEMBERS</Text>
              </ImageBackground>
            </Card>
          </TouchableOpacity>
        </Animatable.View>

        {/* <Animatable.View
          animation="bounceInLeft"
          easing="ease-out"
          iterationCount={1}
          style={{ paddingBottom: 85 }}
        >
          <TouchableOpacity
            style={styles.tileOpacity}
            onPress={() => {
              props.navigation.navigate("CurrencyExchange", {
                // trip: trip,
              });
            }}
          >
            <Card style={styles.tile}>
              <ImageBackground
                style={styles.container}
                source={require("../../assets/images/exchange.jpg")}
                imageStyle={{ borderRadius: 10 }}
              >
                <Text style={styles.innerText}>CURRANCY EXCHANGE</Text>
              </ImageBackground>
            </Card>
          </TouchableOpacity>
        </Animatable.View> */}
      </View>
    </ScrollView>
  );
};
mainMenuScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Trip",
  };
};

const styles = StyleSheet.create({
  scrollScreen: {
    backgroundColor: "#2C2C2E",
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",

    // justifyContent: "center",
    // alignItems: "center",
  },
  titleContainer: {
    alignSelf: "center",
    width: "90%",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 27,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 15,
    paddingLeft: 20,
    // alignSelf: "center",
    color: "#F2F2F7",

    justifyContent: "center",
  },
  tileOpacity: {
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    width: "80%",
    // maxWidth: 400,
    // minHeight: 120,
    // paddingHorizontal: 20,
    // paddingVertical: 5,
    // alignItems: "center",
    // justifyContent: "center",
    // marginBottom: 20,
    // backgroundColor: "red",
  },
  tile: {
    // width: "80%",
    // maxWidth: 400,
    minHeight: 120,
    // paddingHorizontal: 20,
    // paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    color: "#F2F2F7",

    // backgroundColor: "red",
  },
  innerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 0,
  },

  container: {
    flex: 1,
    width: "100%",
    // resizeMethod: "auto",
    resizeMode: "center",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 10,
    // blurRadius: "10",
    // blurRadius: 6,
  },
});

export default mainMenuScreen;
