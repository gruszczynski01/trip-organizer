import React, { useState, useReducer, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { not } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import * as tripActions from "../../store/actions/trips";

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

const tripNameScreen = (props) => {
  const dispatch = useDispatch();

  const trip = props.navigation.getParam("trip");
  var editedTrip = null;
  if (trip != -1) {
    editedTrip = useSelector((state) =>
      state.trips.userTrips.find((tripElem) => tripElem.id === trip.id)
    );
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedTrip ? editedTrip.name : "",
    },
    inputValidities: {
      name: editedTrip ? true : false,
    },
    formIsValid: editedTrip ? true : false,
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

  const nextHandler = async () => {
    // inputChangeHandler();

    var body = {
      ...props.navigation.state.params,
      name: formState.inputValues.name,
    };

    if (!!editedTrip) {
      await dispatch(
        tripActions.editTrip(
          editedTrip.id,
          body.name,
          body.destination,
          body.tripBeginning,
          body.tripEnding
        )
      );
    } else {
      await dispatch(
        tripActions.addTrip(
          body.name,
          body.destination,
          body.tripBeginning,
          body.tripEnding
        )
      );
    }

    props.navigation.navigate("TripList");
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      //keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <View style={styles.mainContent}>
        <Text style={styles.title}>Enter trip name 😁</Text>
        <Card style={styles.input}>
          <ScrollView>
            <Input
              labelStyle={{ color: "white" }}
              id="name"
              label="Name"
              required
              autoCapitalize="none"
              errorText="Please enter a valid name."
              onInputChange={inputChangeHandler}
              initialValue={editedTrip ? editedTrip.name : ""}
              initiallyValid={!!editedTrip}
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={nextHandler} />
            </View>
          </ScrollView>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

tripNameScreen.navigationOptions = {
  headerTitle: "Select destination",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    color: "white",
  },
  input: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "black",
  },
  buttonContainer: {
    paddingVertical: 20,
  },
});

export default tripNameScreen;
