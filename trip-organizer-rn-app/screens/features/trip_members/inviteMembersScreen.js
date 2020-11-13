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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/technical/Card";
import Input from "../../../components/technical/Input";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import * as taskActions from "../../../store/actions/tasks";
import * as tripActions from "../../../store/actions/trips";
import * as userActions from "../../../store/actions/users";
import Moment from "moment";
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

//aaaaaaa

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const inviteMembersScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [data, setData] = useState([]);
  const [searchedPhrase, setSearchedPhrase] = useState("");

  const members = useSelector((state) => state.users.searchedUsers);
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
      await dispatch(userActions.getSearchedUsers(searchedPhrase));
      // await dispatch(userActions.getSearchedUsers("jacek"));
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    console.log(members);

    setData();
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError, searchedPhrase]);

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.screen}>
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Card style={styles.card}>
              <ScrollView>
                <Input
                  labelStyle={styles.input}
                  inputStyle={styles.inputStyle}
                  id="name"
                  label="Search for user"
                  keyboardType="default"
                  // errorText="Please enter a valid name."
                  onChangeText={(val) => {
                    setSearchedPhrase(val);
                    console.log(searchedPhrase);
                  }}
                  value={searchedPhrase}
                  // onInputChange={(val) => {
                  //   console.log("Typed: " + val);
                  // }}
                  onInputChange={() => {
                    setSearchedPhrase(searchedPhrase);
                  }}
                  placeholder="Type name, surname or email..."
                  // initialValue={editedTask ? editedTask.name : ""}
                  // initiallyValid={!!editedTask}
                />
              </ScrollView>
            </Card>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
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
                        borderColor: itemData.item.ifAlreadyInTrip
                          ? "grey"
                          : "black",
                        borderWidth: 2,
                      }}
                    >
                      <View style={styles.contentContainer}>
                        <View>
                          <View style={styles.nameContainer}>
                            <Text
                              style={{
                                // styles.fullName
                                ...styles.fullName,
                                color: itemData.item.ifAlreadyInTrip
                                  ? "grey"
                                  : "white",
                              }}
                            >
                              {itemData.item.name} {itemData.item.surname}
                            </Text>
                          </View>
                          <View
                            style={{
                              borderTopColor: "grey",
                              borderTopWidth: 1,

                              // paddingHorizontal: 5,
                              // marginHorizontal: 5,
                              width: "95%",
                              paddingTop: 10,
                              paddingBottom: 10,
                              // alignItems: "center",
                              alignContent: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={styles.ownerName}>
                              {itemData.item.email}
                            </Text>
                          </View>
                          {itemData.item.ifAlreadyInTrip && (
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
                                Already in trip
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={styles.checkmarkContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            // itemData.item.ifDone = !itemData.item.ifDone;

                            dispatch(
                              taskActions.editTask(
                                itemData.item.id,
                                itemData.item.name,
                                itemData.item.description,
                                !itemData.item.ifDone,
                                itemData.item.owner
                              )
                            );
                            tasks.sort(compareTasks);
                            loadTasks();
                          }}
                        >
                          <Ionicons
                            name={
                              !itemData.item.ifAlreadyInTrip
                                ? "ios-mail"
                                : "ios-send"
                            }
                            size={32}
                            color={
                              !itemData.item.ifAlreadyInTrip
                                ? "#ff9500"
                                : "#007aff"
                            }
                          />
                        </TouchableOpacity>
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

inviteMembersScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Invite someone",
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       buttonStyle={{ color: "#147efb" }}
    //       title="Add"
    //       iconName="ios-save"
    //       onPress={submitFn}
    //       //TO DO: save or edit Task

    //       // navData.navigation.goBack();
    //     />
    //   </HeaderButtons>
    // ),
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
    marginTop: 15,
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
    textTransform: "uppercase",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1,
    // margin: 30,

    color: "white",
    paddingLeft: 5,
  },
  ownerName: {
    fontSize: 17,
    letterSpacing: 1,
    // fontWeight: "bold",
    paddingLeft: 5,
    color: "#F2F2F7",
  },
  input: { color: "#F2F2F7" },
  inputStyle: { color: "#F2F2F7" },
  cardContainer: { alignItems: "center" },
  card: {
    width: "90%",
    // maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    paddingTop: 10,
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
    width: "90%",
    justifyContent: "center",
    alignContent: "center",
  },
  nameContainer: {
    flex: 1,

    justifyContent: "center",
    alignContent: "center",
    paddingBottom: 6,
  },
  flatListContainer: {
    flex: 1,
  },
  checkmarkContainer: {
    width: "10%",
    justifyContent: "center",
    alignContent: "center",
    paddingLeft: 3,
  },
});

export default inviteMembersScreen;
