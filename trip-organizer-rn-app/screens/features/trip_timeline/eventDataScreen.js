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

const eventDataScreen = (props) => {
  const dispatch = useDispatch();

  const trip = props.navigation.getParam("trip");
  const event = props.navigation.getParam("event");
  var editedEvent = null;
  if (event != -1) {
    editedEvent = useSelector((state) =>
      state.events.tripEvents.find((eventElem) => eventElem.id === event.id)
    );
  }

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

  const submitHandler = useCallback(async () => {
    var body = {
      ...props.navigation.state.params,
      title: formState.inputValues.title,
      description: formState.inputValues.desc,
    };

    console.log("DEBUG: SUBMIT HANDLER");
    console.log(body);

    // console.log(formState.inputValues.title);
    // console.log(formState.inputValues.desc);
    // console.log(Moment(props.navigation.state.params.).format("DD-MM-YYYY"));
    // console.log(Moment(date).format("HH:mm"));

    // const dispatch = useDispatch();

    if (!!editedEvent) {
      await dispatch(
        eventActions.editEvent(
          editedEvent.id,
          body.title,
          body.description,
          Moment(body.date).format("DD-MM-YYYY"),
          Moment(body.date).format("HH:mm")
        )
      );
    } else {
      await dispatch(
        eventActions.addEvent(
          body.title,
          body.description,
          Moment(body.date).format("DD-MM-YYYY"),
          Moment(body.date).format("HH:mm"),
          trip.id
        )
      );
    }
    props.navigation.navigate("TripTimeline", { trip: trip });
  }, [dispatch, editedEvent, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <View style={styles.mainContainer}>
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

eventDataScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Add new event",
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
    marginTop: 30,
    // alignItems: "center",
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

export default eventDataScreen;
