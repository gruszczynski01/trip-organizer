import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import Timeline from "react-native-timeline-flatlist";
import DateTimePicker from "@react-native-community/datetimepicker";
import HorizontalDatePicker from "@logisticinfotech/react-native-horizontal-date-picker";

const tripTimelineScreen = (props) => {
  const [dates, setDates] = useState(new Date(1598051730000));

  const data = [
    {
      time: "09:00",
      title: "Archery Training",
      description:
        "The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ",
      circleColor: "#009688",
      lineColor: "#009688",
    },
    {
      time: "10:45",
      title: "Play Badminton",
      description:
        "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.",
    },
    { time: "12:00", title: "Lunch" },
    {
      time: "14:00",
      title: "Watch Soccer",
      description:
        "Team sport played between two teams of eleven players with a spherical ball. ",
      lineColor: "#009688",
    },
  ];
  const onChangeEnd = (event, selectedDate) => {
    console.log(selectedDate);
  };
  onDateSelected = (date) => {
    console.log("Selected Date:==>", date);
  };
  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        {/* <DateTimePicker
          testID="dateTimePicker"
          mode="date"
          value={dates}
          is24Hour={true}
          display="default"
          onChange={onChangeEnd}
          // minimumDate={startDate}
        /> */}
        <HorizontalDatePicker
          style={styles.datePicker}
          pickerType={"date"}
          onDateSelected={this.onDateSelected}
          isShowYear={false}
        />
      </View>
      <Timeline
        style={styles.list}
        data={data}
        separator={true}
        circleSize={20}
        circleColor="rgb(45,156,219)"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "#ff9797",
          color: "white",
          padding: 5,
          borderRadius: 13,
          overflow: "hidden",
        }}
        descriptionStyle={{ color: "gray" }}
        options={{
          style: { paddingTop: 5 },
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //paddingTop: 65,
    backgroundColor: "white",
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  datePicker: {
    width: "100%",
  },
});
export default tripTimelineScreen;
