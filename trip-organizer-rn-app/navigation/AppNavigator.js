import React from "react";
import {
  createSwitchNavigator,
  createAppContainer,
  DrawerItems,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
// import  from "react-navigation-switch";

import { Platform, SafeAreaView, Button, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";

import StartupScreen from "../screens/StartupScreen";
import signInScreen from "../screens/authentication/signInScreen";
import signUpScreen from "../screens/authentication/signUpScreen";
import userProfileScreen from "../screens/user_profile/userProfileScreen";
import editUserProfileScreen from "../screens/user_profile/editUserProfileScreen";
import tripListScreen from "../screens/trip/tripListScreen";
import editTripListScreen from "../screens/trip/editTripListScreen";
import tripDestinationScreen from "../screens/trip/tripDestinationScreen";
import tripTimeScreen from "../screens/trip/tripTimeScreen";
import addMembersScreen from "../screens/trip/addMembersScreen";
import tripNameScreen from "../screens/trip/tripNameScreen";
import mainMenuScreen from "../screens/technical/mainMenuScreen";
import currencyExchangeScreen from "../screens/features/currency_exchange/currencyExchangeScreen";
import toDoListScreen from "../screens/features/to_do_list/toDoListScreen";
import tripMembersScreen from "../screens/features/trip_members/tripMembersScreen";
import tripTimelineScreen from "../screens/features/trip_timeline/tripTimelineScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const AppNavigator = createStackNavigator(
  {
    TripList: tripListScreen,
    EditTripList: editTripListScreen,
    TripDestination: tripDestinationScreen,
    TripTime: tripTimeScreen,
    AddMembers: addMembersScreen,
    TripName: tripNameScreen,
    MainMenu: mainMenuScreen,
    CurrencyExchange: currencyExchangeScreen,
    ToDoList: toDoListScreen,
    TripMembers: tripMembersScreen,
    TripTimetable: tripTimelineScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const SettingsNavigator = createStackNavigator(
  {
    UserProfile: userProfileScreen,
    EditUserProfile: editUserProfileScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainTabsNavigator = createBottomTabNavigator(
  {
    App: AppNavigator,
    Settings: SettingsNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    SignIn: signInScreen,
    SignUp: signUpScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: MainTabsNavigator,
});

export default createAppContainer(MainNavigator);
