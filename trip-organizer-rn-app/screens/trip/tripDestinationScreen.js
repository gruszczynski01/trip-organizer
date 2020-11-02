import React, { useState, useReducer, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";

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

const tripDestinationScreen = (props) => {
  const trip = props.navigation.getParam("trip");
  const editedTrip = useSelector((state) =>
    state.trips.userTrips.find((tripElem) => tripElem.id === trip.id)
  );
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedTrip ? editedTrip.name : "",
    },
    inputValidities: {
      name: editedTrip ? true : false,
    },
    formIsValid: editedTrip ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

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
    console.log(formState);

    props.navigation.navigate("TripTime", {
      destination: formState.inputValues.name,
      trip: trip,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      //keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <View style={styles.mainContent}>
        <Text style={styles.title}>Where are you going?</Text>
        <Card style={styles.input}>
          <ScrollView>
            <Input
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
              <Button title="Next" onPress={nextHandler} />
            </View>
          </ScrollView>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

tripDestinationScreen.navigationOptions = {
  headerTitle: "Select destination",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 45,
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
});

export default tripDestinationScreen;
