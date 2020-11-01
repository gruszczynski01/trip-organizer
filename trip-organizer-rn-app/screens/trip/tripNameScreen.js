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
import { useDispatch } from "react-redux";
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
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: "",
    },
    inputValidities: {
      name: false,
    },
    formIsValid: false,
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
    // inputChangeHandler();

    var body = {
      ...props.navigation.state.params,
      name: formState.inputValues.name,
    };

    console.log({
      name: body.name,
      dest: body.destination,
      beg: body.tripBeginning,
      end: body.tripEnding,
    });

    await dispatch(
      tripActions.addTrip(
        body.name,
        body.destination,
        body.tripBeginning,
        body.tripEnding
      )
    );

    props.navigation.navigate("TripList");

    // setError(null);
    // setIsLoading(true);
    // try {
    //   await dispatch(action);
    //   props.navigation.navigate("Shop");
    // } catch (err) {
    //   setError(err.message);
    //   setIsLoading(false);
    // }
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
              id="name"
              label="Name"
              required
              autoCapitalize="none"
              errorText="Please enter a valid name."
              onInputChange={inputChangeHandler}
              initialValue=""
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

export default tripNameScreen;
