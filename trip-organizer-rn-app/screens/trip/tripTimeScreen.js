import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import { Calendar } from "react-native-calendars";
import CalendarStrip from "react-native-calendar-strip";

const tripTimeScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>When are you going?</Text>
      <Text style={styles.subtitle}>Trip begining</Text>
      <View>
        <CalendarStrip
          scrollable
          style={{
            height: 200,
            paddingTop: 20,
            paddingBottom: 10,
            width: "100%",
          }}
          calendarColor={"#3343CE"}
          calendarHeaderStyle={{ color: "white" }}
          dateNumberStyle={{ color: "white" }}
          dateNameStyle={{ color: "white" }}
          iconContainer={{ flex: 0.1 }}
        />
      </View>
      <Text style={styles.subtitle}>Trip ending</Text>
      <View>
        <CalendarStrip
          scrollable
          style={{
            height: 200,
            paddingTop: 20,
            paddingBottom: 10,
            width: "100%",
          }}
          calendarColor={"#3343CE"}
          calendarHeaderStyle={{ color: "white" }}
          dateNumberStyle={{ color: "white" }}
          dateNameStyle={{ color: "white" }}
          iconContainer={{ flex: 0.1 }}
        />
      </View>
      <Card style={styles.input}>
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            // color={Colors.accent}
            onPress={() => {
              props.navigation.navigate("TripTime");

              // setIsSignup((prevState) => !prevState);
            }}
          />
        </View>
      </Card>
    </View>
  );
};

tripTimeScreen.navigationOptions = {
  headerTitle: "Select time period",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 45,
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
  input: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  container: { flex: 1 },
});

export default tripTimeScreen;
