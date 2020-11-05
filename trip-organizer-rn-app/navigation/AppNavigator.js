import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
// import  from "react-navigation-switch";

import {
  Platform,
  SafeAreaView,
  Button,
  View,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import { auth, database } from "../firebase";

import Colors from "../constants/Colors";

import StartupScreen from "../screens/StartupScreen";
import authenticationScreen from "../screens/authentication/authenticationScreen";
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
import addEventScreen from "../screens/features/trip_timeline/addEventScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: "black",
    // borderBottomWidth: "0",
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
    color: "#F2F2F7",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
    color: "#147efb",
  },
  headerTintColor: "#147efb",
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
    TripTimeline: tripTimelineScreen,
    AddEvent: addEventScreen,
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
    App: {
      screen: AppNavigator,
      navigationOptions: {
        tabBarLabel: "Trip",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../assets/icons/trip.png")} //Icons made by Freepik "https://www.flaticon.com/authors/freepik"
            style={{ width: 26, height: 26, tintColor: tintColor }}
          />
        ),
      },
    },

    Settings: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <Image
            source={require("../assets/icons/user-profile.png")} //Icons made by Freepik "https://www.flaticon.com/authors/freepik"
            style={{ width: 26, height: 26, tintColor: tintColor }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: "black",
        borderTopColor: "transparent",
      },
    },
  }
  //   {
  //     contentOptions: {
  //       activeTintColor: Colors.primary,
  //     },
  //     contentComponent: (props) => {
  //       const dispatch = useDispatch();
  //       return (
  //         <View style={{ flex: 1, paddingTop: 20 }}>
  //           <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
  //             <DrawerItems {...props} />
  //             <Button
  //               title="Logout"
  //               color={Colors.primary}
  //               onPress={() => {
  //                 dispatch(authActions.logout());
  //                 // props.navigation.navigate('Auth');
  //               }}
  //             />
  //           </SafeAreaView>
  //         </View>
  //       );
  //     },
  //   }
);

// const AuthNavigator = createStackNavigator(
//   {
//     SignIn: signInScreen,
//     SignUp: signUpScreen,
//   },
//   {
//     header: null,
//   }
// );
const DrawerNavigator = createDrawerNavigator(
  {
    MainTabs: MainTabsNavigator,
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
            <Image
              source={require("../assets/icons/logout.png")} //Icons made by Freepik "https://www.flaticon.com/authors/freepik"
              style={{
                width: 26,
                height: 26,
                tintColor: "red",
                alignSelf: "center",
              }}
            />
            <Button
              title="Logout"
              color="red" //{Colors.primary}
              onPress={() => {
                auth
                  .signOut()
                  .then(function () {
                    console.log("Wylogowano poprawnie");
                  })
                  .catch(function (error) {
                    console.log("Błąd przy wylogowywaniu");
                  });
                dispatch(authActions.logout());
                props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: authenticationScreen,
  Drawer: DrawerNavigator,
});

export default createAppContainer(MainNavigator);
