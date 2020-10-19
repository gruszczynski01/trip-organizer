import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";

const tripDestinationScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Where are you going?</Text>
      <Card style={styles.input}>
        <Input
          id="name"
          label="Name"
          required
          autoCapitalize="none"
          errorText="Please enter a valid name."
          // onInputChange={inputChangeHandler}
          initialValue=""
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            // color={Colors.accent}
            onPress={() => {
              props.navigation.navigate("TripTime");

              // setIsSignup((prevState) => !prevState);
            }}
          />
        </View>
      </Card>
    </View>
  );
};

tripDestinationScreen.navigationOptions = {
  headerTitle: "Select destination",
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
