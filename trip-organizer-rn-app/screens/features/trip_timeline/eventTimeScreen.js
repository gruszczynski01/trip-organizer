import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/technical/Card";
import Input from "../../../components/technical/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import * as eventActions from "../../../store/actions/events";
import Moment from "moment";

const eventTimeScreen = (props) => {
  const trip = props.navigation.getParam("trip");
  const event = props.navigation.getParam("event");
  var editedEvent = null;
  if (event != -1) {
    editedEvent = useSelector((state) =>
      state.events.tripEvents.find((eventElem) => eventElem.id === event.id)
    );
  }
  const [date, setDate] = useState(
    new Date(new Date(trip.tripBeginning).setHours(9, 0, 0, 0))
  );

  useEffect(() => {
    if (!!editedEvent) {
      setDate(
        new Date(
          editedEvent.date.substring(6, 10),
          editedEvent.date.substring(3, 5) - 1,
          editedEvent.date.substring(0, 2),
          editedEvent.time.substring(0, 2),
          editedEvent.time.substring(3, 5)
        ).toISOString()
      );
    }
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  // useEffect(() => {
  //   props.navigation.setParams({ submit: submitHandler });
  // }, [submitHandler]);

  return (
    <KeyboardAvoidingView behavior="position" style={styles.screen}>
      <View style={styles.mainContainer}>
        <View style={styles.dataTimePickerContainer}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={onChange}
            // onChange={() => {
            //   console.log("ZAMIAAANAA");
            // }}
            style={{ color: "white" }}
            minimumDate={new Date(trip.tripBeginning).setHours(0, 0, 0, 0)}
            maximumDate={new Date(trip.tripEnding).setHours(23, 59, 59, 0)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            // color={Colors.accent}
            onPress={() => {
              console.log({
                ...props.navigation.state.params,
                date: date,
              });
              props.navigation.navigate("EventData", {
                ...props.navigation.state.params,
                date: date,
              });

              // setIsSignup((prevState) => !prevState);
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

eventTimeScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Select event time",
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       buttonStyle={{ color: "#147efb" }}
    //       title="Add"
    //       iconName="ios-save"
    //       onPress={submitFn}
    //       //TO DO: save or edit event

    //       // navData.navigation.goBack();
    //     />
    //   </HeaderButtons>
    // ),
  };
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    // alignItems: "center",
  },
  dataTimePickerContainer: {
    marginVertical: 20,
  },
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    // alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 45,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    color: "white",
  },
  input: { color: "#F2F2F7" },
  inputStyle: { color: "#F2F2F7" },

  cardContainer: { alignItems: "center" },
  card: {
    width: "90%",
    // maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    // backgroundColor: "#202022",
    backgroundColor: "black",
  },
});

export default eventTimeScreen;
