import React from "react";
import { Text, View, StyleSheet, Button, ImageBackground } from "react-native";
import MenuTile from "../../components/technical/MenuTile";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

// const image = require("../../assets/images/time_table.jpg");
// const image = { uri: "https://reactjs.org/logo-og.png" };

const mainMenuScreen = (props) => {
  return (
    <ScrollView>
      <View style={styles.screen}>
        <Text style={styles.title}>WYJAZD PO SESJI</Text>
        <TouchableOpacity
          style={styles.tileOpacity}
          onPress={() => {
            props.navigation.navigate("TripTimeline");
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

        <TouchableOpacity style={styles.tileOpacity}>
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
        <TouchableOpacity style={styles.tileOpacity}>
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
        <TouchableOpacity style={styles.tileOpacity}>
          <Card style={styles.tile}>
            <ImageBackground
              style={styles.container}
              source={require("../../assets/images/exchange.jpg")}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.innerText}>EXCHANGE MONEY</Text>
            </ImageBackground>
          </Card>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
mainMenuScreen.navigationOptions = {
  headerTitle: "Your Trip",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    // alignSelf: "center",
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
    marginBottom: 20,
    // backgroundColor: "red",
  },
  innerText: {
    fontSize: 30,
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
