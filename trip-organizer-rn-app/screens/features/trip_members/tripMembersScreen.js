import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/technical/Card";
import Input from "../../../components/technical/Input";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import * as taskActions from "../../../store/actions/tasks";
import * as tripActions from "../../../store/actions/trips";
import Moment from "moment";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

//aaaaaaa

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const tripMembersScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [data, setData] = useState([]);

  const members = useSelector((state) => state.trips.tripMembers);
  const loggedUserId = useSelector((state) => state.auth.userId);
  // const [selectedMember, setSelectedMember] = useState(loggedUserId);
  const trip = props.navigation.getParam("trip");

  // const latitudeDelta = 0.025;
  // const longitudeDelta = 0.025;
  //night google maps style

  // trip members

  const loadTripMembers = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(tripActions.getTripMembers(trip.id));
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    console.log(members);

    setData();
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadTripMembers
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadTripMembers]);

  useEffect(() => {
    setIsLoading(true);
    loadTripMembers().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadTripMembers]);

  const submitHandler = useCallback(async () => {
    props.navigation.navigate("InviteMembers", {
      members: members,
      trip: { id: trip.id, name: trip.name },
    });
  }, [dispatch]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  useEffect(() => {
    members.sort(compareUsers);
  }, [members]);

  function compareUsers(a, b) {
    if (a.ifActive == false && b.ifActive == true) {
      return 1;
    }
    if (a.ifActive == true && b.ifActive == false) {
      return -1;
    }
    return 0;
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.screen}>
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.titleContainerItem}>
              <Ionicons name="ios-people" size={42} color="white" />
            </View>

            <View style={styles.titleContainerItem}>
              <Text style={styles.title}>Trip members</Text>
            </View>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 85 }}
              onRefresh={loadTripMembers}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={loadTripMembers}
                  tintColor="#F2F2F7"
                />
              }
              refreshing={isRefreshing}
              data={members}
              bounces={true}
              keyExtractor={(item) => item.id}
              renderItem={(itemData) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(itemData.item);
                      if (itemData.item.ifActive) {
                        Alert.alert(
                          itemData.item.name + " " + itemData.item.surname,
                          "Do you want to delete  user from trip?",
                          [
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                console.log("Deleting");
                                dispatch(
                                  tripActions.deleteUserFromTrip(
                                    itemData.item.id,
                                    trip.id
                                  )
                                );
                                // console.log(trip);
                                // dispatch(tripActions.deleteTrip(trip.id));
                              },
                            },
                            {
                              text: "Cancel",
                              style: "cancel",
                              onPress: () => {
                                console.log("Editing");
                              },
                            },
                          ]
                        );
                      } else {
                        Alert.alert(
                          itemData.item.name + " " + itemData.item.surname,
                          "User doesn't accept invitation yet"
                        );
                      }

                      // setSelectedMember(itemData.item.id);
                    }}
                    onLongPress={(trip) => {
                      // console.log("onLongPress: trip: ", itemData.item);
                      // setEditMode(true);
                      // longPressHandler(itemData.item);
                    }}
                    // animation="bounceInLeft"
                    // iterationCount={1}
                    // easing="linear"
                  >
                    <Card
                      style={{
                        ...styles.cartItem,
                        borderColor: itemData.item.ifActive ? "black" : "grey",
                        borderWidth: 2,
                      }}
                    >
                      <View style={styles.contentContainer}>
                        <View>
                          <View style={styles.nameContainer}>
                            <Text
                              style={{
                                ...styles.fullName,
                                color: itemData.item.ifActive
                                  ? "white"
                                  : "grey",
                              }}
                            >
                              {itemData.item.name} {itemData.item.surname}
                            </Text>
                          </View>
                          {!itemData.item.ifActive && (
                            <View
                              animation="flipInX"
                              iterationCount={1}
                              easing="linear"
                              style={{
                                width: "100%",

                                paddingTop: 8,
                                // alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={styles.description}>
                                Request sent
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
        {/* <View style={styles.map}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={MapStyle}
            style={styles.map}
            initialRegion={{
              latitudeDelta,
              longitudeDelta,
              latitude: 12.840575,
              longitude: 77.651787,
            }}
          />
        </View> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

tripMembersScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Trip members",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-add-circle-outline"
          onPress={submitFn}
          //TO DO: save or edit Task

          // navData.navigation.goBack();
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    // borderColor: "red",
    // borderWidth: 1,
    // marginTop: 30,
    // alignItems: "center",
  },

  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    // alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  titleContainer: {
    // flex: 1,
    flexDirection: "row",
    width: "100%",

    justifyContent: "center",
    // borderColor: "blue",
    // borderWidth: 1,
    // alignContent
  },
  description: {
    fontSize: 13,
    letterSpacing: 1,
    //fontWeight: "",
    paddingLeft: 5,
    color: "#9e9e9e",
  },

  titleContainerItem: {
    justifyContent: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    paddingBottom: 10,
    color: "white",
  },
  fullName: {
    // textTransform: "uppercase",
    fontSize: 15,
    // fontWeight: "bold",
    letterSpacing: 1,
    // margin: 30,

    color: "white",
    paddingLeft: 5,
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
  cartItem: {
    padding: 10,
    backgroundColor: "black",
    // flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignContent: "stretch",
    marginHorizontal: 20,
    marginTop: 20,
    minHeight: 55,
    flex: 1,
    flexDirection: "row",
  },

  contentContainer: {
    width: "95%",
    justifyContent: "center",
    alignContent: "center",
  },
  nameContainer: {
    flex: 1,

    justifyContent: "center",
    alignContent: "center",
  },
  flatListContainer: {
    flex: 1,
  },
});

export default tripMembersScreen;
