import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

import Timeline from "react-native-timeline-flatlist";
import DateTimePicker from "@react-native-community/datetimepicker";
import HorizontalDatePicker from "@logisticinfotech/react-native-horizontal-date-picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";

const tripTimelineScreen = (props) => {
  const trip = props.navigation.getParam("trip");
  console.log(trip);
  // props.navigation.setParams();
  const [date, setDate] = useState(new Date(trip.tripBeginning));

  const data = [
    {
      time: "09:00",
      title: "Archery Training",
      description:
        "The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ",
      // circleColor: "orange",
      // lineColor: "",
    },
    {
      time: "10:45",
      title: "Play Badminton",
      description:
        "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.",
      lineColor: "grey",
      circleColor: "orange",
    },
    { time: "12:00", title: "Lunch", lineColor: "grey", circleColor: "orange" },
    {
      time: "13:00",
      title: "Dinner",
      lineColor: "grey",
      circleColor: "orange",
    },
    {
      time: "14:00",
      title: "Watch Soccer",
      description:
        "Team sport played between two teams of eleven players with a spherical ball. ",
      lineColor: "grey",
      circleColor: "orange",
    },
  ];
  const onChangeEnd = (event, selectedDate) => {
    console.log(selectedDate);
  };

  useEffect(() => {
    props.navigation.setParams({ trip: trip });
  }, [trip]);

  onDateSelected = (date) => {
    console.log("Selected Date:==>", date);
    setDate(date);
  };
  return (
    <View style={styles.container}>
      <Text></Text>
      <View style={styles.datePickerContainer}>
        <HorizontalDatePicker
          minDate={new Date(trip.tripBeginning)}
          maxDate={new Date(trip.tripEnding)}
          style={styles.datePicker}
          pickerType={"date"}
          onDateSelected={onDateSelected}
          isShowYear={true}
        />
      </View>
      <Timeline
        style={styles.list}
        data={data}
        separator={true}
        circleSize={20}
        onEventPress={(event) => {
          console.log(event);
        }}
        circleColor="orange"
        lineColor="grey"
        timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "#147efb",
          color: "white",
          padding: 5,
          borderRadius: 13,
          overflow: "hidden",
        }}
        titleStyle={{ color: "white" }}
        descriptionStyle={{ color: "gray" }}
        options={{
          style: { paddingTop: 5 },
        }}
      />
    </View>
  );
};

tripTimelineScreen.navigationOptions = (navData) => {
  const trip = navData.navigation.getParam("trip");

  return {
    headerTitle: "Timeline",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-add"
          onPress={() => {
            navData.navigation.navigate("AddEvent", { trip: trip, event: -1 });
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  datePickerContainer: {
    paddingBottom: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    padding: 20,
    //paddingTop: 65,
    backgroundColor: "#2C2C2E",
  },
  list: {
    flex: 1,
    paddingTop: 5,
    // marginTop: 3,
  },
  datePicker: {
    width: "100%",
  },
});
export default tripTimelineScreen;
