import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/technical/HeaderButton";
import * as authActions from "../../store/actions/auth";
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

const editUserProfileScreen = (props) => {
  const dispatch = useDispatch();

  const name = props.navigation.getParam("trip");
  const event = props.navigation.getParam("event");
  const loggedUser = useSelector((state) => state.auth.loggedUser);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: loggedUser.name,
      surname: loggedUser.surname,
    },
    inputValidities: {
      name: true,
      surname: true,
    },
    formIsValid: true,
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
    await dispatch(
      authActions.editUser(
        loggedUser.id,
        loggedUser.email,
        formState.inputValues.name,
        formState.inputValues.surname
      )
    );

    // props.navigation.goBack();
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);
  const deleteAccoutHandler = async () => {
    Alert.alert(
      "Deleting account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            console.log("Deleting");
            await dispatch(authActions.deleteAccount());
            props.navigation.navigate("Auth");
            // dispatch(eventActions.deleteEvent(event.id, trip.id));
          },
        },
        {
          text: "No",
          style: "default",
        },
      ]
    );
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <View style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <ScrollView>
              <Input
                labelStyle={styles.input}
                inputStyle={styles.inputStyle}
                id="name"
                label="Name"
                keyboardType="default"
                required
                errorText="Please enter a valid name."
                onInputChange={inputChangeHandler}
                initialValue={loggedUser.name}
                initiallyValid={true}
              />

              <Input
                labelStyle={styles.input}
                inputStyle={styles.inputStyle}
                style={styles.input}
                id="surname"
                label="Surname"
                keyboardType="default"
                required
                errorText="Please enter a valid surname."
                multiline={true}
                umberOfLines={4}
                onInputChange={inputChangeHandler}
                initialValue={loggedUser.surname}
                initiallyValid={true}
              />
            </ScrollView>
          </Card>
        </View>
        <View>
          <Button
            title="Delete account"
            color="red"
            onPress={deleteAccoutHandler}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

editUserProfileScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Edit user",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-save"
          onPress={() => {
            submitFn();
            navData.navigation.goBack();
          }}
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
    marginTop: 30,
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 120,
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

export default editUserProfileScreen;
