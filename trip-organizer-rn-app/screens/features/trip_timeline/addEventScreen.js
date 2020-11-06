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
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const addEventScreen = (props) => {
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
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedEvent ? editedEvent.title : "",
      desc: editedEvent ? editedEvent.description : "",
    },
    inputValidities: {
      title: editedEvent ? true : false,
      desc: editedEvent ? true : false,
    },
    formIsValid: editedEvent ? true : false,
  });
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const dispatch = useDispatch();

  const submitHandler = useCallback(async () => {
    console.log("DEBUG: SUBMIT HANDLER");

    console.log(formState.inputValues.title);
    console.log(formState.inputValues.desc);
    console.log(Moment(date).format("DD-MM-YYYY"));
    console.log(Moment(date).format("HH:mm"));

    // const dispatch = useDispatch();

    if (!!editedEvent) {
      // await dispatch(
      //   tripActions.editTrip(
      //     editedTrip.id,
      //     body.title,
      //     body.destination,
      //     body.tripBeginning,
      //     body.tripEnding
      //   )
      // );
    } else {
      await dispatch(
        eventActions.addEvent(
          formState.inputValues.title,
          formState.inputValues.desc,
          Moment(date).format("DD-MM-YYYY"),
          Moment(date).format("HH:mm"),
          trip.id
        )
      );
    }
    console.log("DEBUG: SUBMIT HANDLER BEFORE NAV");

    props.navigation.goBack();
  }, [dispatch, editedEvent, formState]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(" DEBUG: ONCHANGE000 START");
    //console.log(currentDate.getTime());

    setDate(currentDate);
    console.log("DEBUG: ONCHANGE000 STOP");
  };
  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  // useEffect(() => {
  //   if (!!editedEvent) {
  //     setDate(
  //       new Date(
  //         editedEvent.date.substring(6, 10),
  //         editedEvent.date.substring(3, 5) - 1,
  //         editedEvent.date.substring(0, 2),
  //         editedEvent.time.substring(0, 2),
  //         editedEvent.time.substring(3, 5)
  //       ).toISOString()
  //     );
  //   } else {
  //     // setDate(new Date(trip.tripBeginning));
  //     setDate(new Date(new Date(trip.tripBeginning).setHours(9, 0, 0, 0)));
  //   }
  // }, []);

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

        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <ScrollView>
              <Input
                labelStyle={styles.input}
                inputStyle={styles.inputStyle}
                id="title"
                label="Title"
                keyboardType="default"
                required
                errorText="Please enter a valid title."
                onInputChange={inputChangeHandler}
                initialValue={editedEvent ? editedEvent.title : ""}
                initiallyValid={!!editedEvent}
              />

              <Input
                labelStyle={styles.input}
                inputStyle={styles.inputStyle}
                style={styles.input}
                id="desc"
                label="Description"
                keyboardType="default"
                required
                errorText="Please enter a valid description."
                multiline={true}
                umberOfLines={4}
                onInputChange={inputChangeHandler}
                initialValue={editedEvent ? editedEvent.description : ""}
                initiallyValid={!!editedEvent}
              />
            </ScrollView>
          </Card>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

addEventScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Add new event",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-save"
          onPress={submitFn}
          //TO DO: save or edit event

          // navData.navigation.goBack();
        />
      </HeaderButtons>
    ),
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

export default addEventScreen;
