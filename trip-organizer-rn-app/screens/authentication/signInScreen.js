import React from "react";
import { Text, View, ScrollView } from "react-native";
import LoginScreen from "react-native-login-screen";

import logo from "../../components/technical/logo";

const signInScreen = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LoginScreen
        // logoComponent={logo}
        disableSettings
        usernameOnChangeText={(username) => console.log("Username: ", username)}
        onPressSettings={() => alert("Settings Button is pressed")}
        passwordOnChangeText={(password) => console.log("Password: ", password)}
        onPressLogin={() => {
          console.log("log in");
        }}
        onPressSignup={() => {
          console.log("onPressSignUp is pressed");
        }}
      >
        {/* <View
          style={{
            position: "relative",
            alignSelf: "center",
            marginTop: 64,
          }}
        >
          <Text style={{ color: "white", fontSize: 30 }}>
            Inside Login Screen Component
          </Text>
        </View> */}
      </LoginScreen>
    </View>
  );
};

signInScreen.navigationOptions = {
  headerShown: false,
};

export default signInScreen;
