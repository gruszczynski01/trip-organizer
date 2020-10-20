import React, { useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
// import { Calendar } from "react-native-calendars";
import CalendarStrip from "react-native-calendar-strip";
import Calendar from "react-native-calendar-select";
import DateTimePicker from "@react-native-community/datetimepicker";

const tripTimeScreen = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShow(Platform.OS === "ios");
    setStartDate(currentDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShow(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>When are you going?</Text>
      <Text style={styles.subtitle}>Trip begining</Text>

      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={new Date().getDate()}
        />
      </View>
      <Text style={styles.subtitle}>Trip ending</Text>
      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={endDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeEnd}
          minimumDate={startDate}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          // color={Colors.accent}
          onPress={() => {
            props.navigation.navigate("AddMembers");

            // setIsSignup((prevState) => !prevState);
          }}
        />
      </View>
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
  subtitle: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 30,
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
