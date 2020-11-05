import React, { useState, useReducer } from "react";
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
  const [date, setDate] = useState(new Date(1598051730000));

  const event = props.navigation.getParam("event");
  var editedEvent = null;
  if (event != -1) {
    editedEvent = useSelector((state) =>
      state.events.tripEvents.find((eventElem) => eventElem.id === event.id)
    );
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedEvent ? editedEvent.name : "",
      desc: editedEvent ? editedEvent.desc : "",
    },
    inputValidities: {
      name: editedEvent ? true : false,
      desc: editedEvent ? true : false,
    },
    formIsValid: editedEvent ? true : false,
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setDate(currentDate);
  };
  const saveHandler = async () => {
    // inputChangeHandler();

    // var body = {
    //   ...props.navigation.state.params,
    //   name: formState.inputValues.name,
    // };

    if (!!saveHandler) {
      // await dispatch(
      //   tripActions.editTrip(
      //     editedTrip.id,
      //     body.name,
      //     body.destination,
      //     body.tripBeginning,
      //     body.tripEnding
      //   )
      // );
    } else {
      await dispatch(
        eventActions
          .addEvent
          // body.name,
          // body.destination,
          // body.tripBeginning,
          // body.tripEnding
          ()
      );
    }

    navData.navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.screen}>
      <Text style={styles.title}>Select time</Text>

      <View style={styles.dataTimePickerContainer}>
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={new Date().getDate()}
          style={{ color: "white" }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Card style={styles.card}>
          <ScrollView>
            <Input
              id="title"
              label="Title"
              keyboardType="default"
              required
              errorText="Please enter a valid title."
              // onInputChange={inputChangeHandler}
              initialValue=""
            />

            <Input
              id="desc"
              label="Description"
              keyboardType="default"
              required
              errorText="Please enter a valid description."
              multiline={true}
              umberOfLines={4}
              // onInputChange={inputChangeHandler}
              initialValue=""
            />
          </ScrollView>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

addEventScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Add new event",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-save"
          onPress={saveHandler}
          //TO DO: save or edit event

          // navData.navigation.goBack();
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  dataTimePickerContainer: {
    backgroundColor: "#cccccc",
    borderRadius: 40,
    marginBottom: 20,
  },
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
  subtitle: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 30,
  },
  card: {
    width: "95%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    backgroundColor: "#cccccc",
  },
});

export default addEventScreen;
