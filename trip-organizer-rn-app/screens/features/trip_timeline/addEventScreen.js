import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import Card from "../../../components/technical/Card";
import Input from "../../../components/technical/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";

const addEventScreen = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShow(Platform.OS === "ios");
    setStartDate(currentDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShow(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.screen}>
      <Text style={styles.title}>Select time</Text>

      <View>
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={new Date().getDate()}
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
          title="Add"
          iconName="ios-save"
          onPress={() => {
            //TO DO: save or edit event
            navData.navigation.goBack();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
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
  },
});

export default addEventScreen;
