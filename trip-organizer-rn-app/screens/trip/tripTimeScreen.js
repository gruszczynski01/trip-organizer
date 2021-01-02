import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
// import { Calendar } from "react-native-calendars";
import CalendarStrip from "react-native-calendar-strip";
import Calendar from "react-native-calendar-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

const tripTimeScreen = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const trip = props.navigation.getParam("trip");
  var editedTrip = null;
  if (trip != -1) {
    editedTrip = useSelector((state) =>
      state.trips.userTrips.find((tripElem) => tripElem.id === trip.id)
    );
  }

  useEffect(() => {
    if (!!editedTrip) {
      setStartDate(new Date(editedTrip.tripBeginning));
      setEndDate(new Date(editedTrip.tripEnding));
    }
  }, []);

  // poprawic pickery, pamietac o offsecie // dokończyć edit

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
    if (currentDate > endDate) {
      setEndDate(currentDate);
    }
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(startDate);
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
          // is24Hour={true}
          display="spinner"
          onChange={onChange}
          minimumDate={new Date(Date.now())}
          // locale="pl-PL"
        />
      </View>
      <Text style={styles.subtitle}>Trip ending</Text>
      <View>
        <DateTimePicker
          // locale="pl-PL"
          dateFormat="dayofweek day month"
          testID="dateTimePicker"
          value={endDate}
          mode="date"
          // is24Hour={true}
          display="spinner"
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
    backgroundColor: "#2C2C2E",
    // alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 25,
    // fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    color: "white",
  },

  subtitle: {
    textTransform: "uppercase",
    fontSize: 15,
    // fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 30,
    color: "white",
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
