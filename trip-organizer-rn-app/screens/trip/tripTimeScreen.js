import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
// import { Calendar } from "react-native-calendars";
import CalendarStrip from "react-native-calendar-strip";
import Calendar from "react-native-calendar-select";
import DateTimePicker from "@react-native-community/datetimepicker";

const tripTimeScreen = (props) => {
  const trip = props.navigation.getParam("trip");
  const editedTrip = useSelector((state) =>
    state.trips.userTrips.find((tripElem) => tripElem.id === trip.id)
  );

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!!editedTrip) {
      setStartDate(editedTrip.tripBeginning);
      setEndDate(editedTrip.tripEnding);
    }
  }, [startDate, endDate]);

  // poprawic pickery

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

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>When are you going?</Text>
      <Text style={styles.subtitle}>Trip begining</Text>

      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode="date"
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
          mode="date"
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
            console.log({
              ...props.navigation.state.params,
              tripBeginning: startDate,
              tripEnding: endDate,
            });
            props.navigation.navigate("TripName", {
              ...props.navigation.state.params,
              tripBeginning: startDate,
              tripEnding: endDate,
            });

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
