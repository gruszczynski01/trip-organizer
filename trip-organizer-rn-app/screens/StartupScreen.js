import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import { auth, database } from "../firebase";
import * as authActions from "../store/actions/auth";

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  console.log("StartUpScreen");

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const userDataJSON = JSON.parse(userData);
      console.log("UD: ");
      console.log(userDataJSON);
      console.log(userDataJSON.userId);
      console.log(!!userDataJSON);
      if (!!!userDataJSON) {
        // dispatch(
        //   authActions.authenticate(
        //     userDataJSON.userId,
        //     userDataJSON.token,
        //     userDataJSON.expirationTime
        //   )
        // );
        props.navigation.navigate("Auth");
        return;
      }

      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      dispatch(authActions.authenticate(userId, token, expirationTime));
      props.navigation.navigate("Drawer");
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartupScreen;
