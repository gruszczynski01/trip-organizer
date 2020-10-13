import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";

const StartupScreen = (props) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello, world! userProfileScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default StartupScreen;
