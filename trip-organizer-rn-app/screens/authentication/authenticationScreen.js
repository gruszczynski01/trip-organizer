import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import LoginScreen from "react-native-login-screen";
import { useDispatch } from "react-redux";

import logo from "../../components/technical/logo";
import * as authActions from "../../store/actions/auth";
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

const authenticationScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    console.log("AuthHandler");
    console.log(formState);

    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    // else {
    //   action = authActions.login(
    //     formState.inputValues.email,
    //     formState.inputValues.password
    //   );
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("MainTabs");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LoginScreen
        // logoComponent={logo}
        disableSettings
        //onPressSettings={() => alert("Settings Button is pressed")}
        // usernameOnChangeText={(username) => console.log("Username: ", username)}
        // passwordOnChangeText={(password) => console.log("Password: ", password)}
        // repasswordOnChangeText={(password) => console.log("Repass: ", password)}
        usernameOnChangeText={inputChangeHandler}
        passwordOnChangeText={inputChangeHandler}
        repasswordOnChangeText={inputChangeHandler}
        onPressLogin={() => {
          authHandler();
          console.log("onPressSignIn is pressed");
        }}
        onPressSignup={() => {
          setIsSignup((prevState) => !prevState);
        }}
      ></LoginScreen>
    </View>
  );
};

authenticationScreen.navigationOptions = {
  headerShown: false,
};

export default authenticationScreen;
