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
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/technical/Card";
import Input from "../../components/technical/Input";
import { Avatar, Accessory } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/technical/HeaderButton";
import * as taskActions from "../../store/actions/tasks";
import * as tripActions from "../../store/actions/trips";
import Moment from "moment";
import { Ionicons } from "@expo/vector-icons";

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

const userProfileScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [data, setData] = useState([]);

  const members = useSelector((state) => state.trips.tripMembers);
  const loggedUserId = useSelector((state) => state.auth.userId);
  const [selectedMember, setSelectedMember] = useState(loggedUserId);
  const trip = props.navigation.getParam("trip");
  const task = props.navigation.getParam("task");

  var editedTask = null;
  // if (task != -1) {
  //   editedTask = useSelector((state) =>
  //     state.tasks.toDoListTasks.find((taskElem) => taskElem.id === task.id)
  //   );
  // }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedTask ? editedTask.name : "",
      desc: editedTask ? editedTask.description : "",
    },
    inputValidities: {
      name: editedTask ? true : false,
      desc: editedTask ? true : false,
    },
    formIsValid: editedTask ? true : false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const submitHandler = useCallback(async () => {
    var body = {
      ...props.navigation.state.params,
      name: formState.inputValues.name,
      description: formState.inputValues.desc,
      owner: selectedMember,
    };

    console.log("DEBUG: SUBMIT HANDLER");
    console.log(body);

    // // console.log(formState.inputValues.name);
    // console.log(formState.inputValues.desc);
    // console.log(Moment(props.navigation.state.params.).format("DD-MM-YYYY"));
    // console.log(Moment(date).format("HH:mm"));

    // const dispatch = useDispatch();

    if (!!editedTask) {
      await dispatch(
        taskActions.editTask(
          editedTask.id,
          formState.inputValues.name,
          formState.inputValues.desc,
          editedTask.ifDone,
          selectedMember
        )
      );
    } else {
      await dispatch(
        taskActions.addTask(
          formState.inputValues.name,
          formState.inputValues.desc,
          false,
          selectedMember,
          trip.to_do_list
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, editedTask, formState, selectedMember]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  // trip members

  const loadTripMembers = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log("BEDE BRAL MEMBERSOW");
      await dispatch(tripActions.getTripMembers(trip.id));
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    console.log("wzialem membersow");
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

  useEffect(() => {
    if (!!editedTask) {
      setSelectedMember(editedTask.owner);
    }
  }, []);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.screen}>
        {/* <ScrollView> */}
        <View style={styles.mainContainer}>
          <View style={{ alignSelf: "center", paddingVertical: 20 }}>
            <Avatar
              source={{
                uri:
                  "https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/102848904_3066354756813371_3616733500491375538_o.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_ohc=ntn9XDr63XkAX_2wEHg&_nc_ht=scontent-waw1-1.xx&oh=3e02024708218cf46bec2c8059796bea&oe=5FD5101E",
              }}
              size="xlarge"
              rounded
              backgroundColor="grey"
              borderColor="grey"
              borderWidth="2"
              // style={{ backgroundColor: "grey" }}
            ></Avatar>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.label}>Szymon Gruszczyński</Text>
            <Text style={styles.subLabel}>gruszczynski01@gmail.com</Text>
            <View style={styles.countersContiner}>
              <View style={styles.subCounterContainer}>
                <View style={styles.subCounterTop}>
                  <Text style={styles.subTripCounter}>28</Text>
                </View>
                <View style={styles.subCounterBottom}>
                  <Text style={styles.subTripLabel}>PAST TRIP</Text>
                </View>
              </View>

              <View style={styles.subCounterContainer}>
                <View style={styles.mainCounterTop}>
                  <Text style={styles.activeTripsCounter}>31</Text>
                </View>
                <View style={styles.mainCounterBottom}>
                  <Text style={styles.activeTripsLabel}>TOTAL TRIPS</Text>
                </View>
              </View>

              <View style={styles.subCounterContainer}>
                <View style={styles.subCounterTop}>
                  <Text style={styles.subTripCounter}>3</Text>
                </View>
                <View style={styles.subCounterBottom}>
                  <Text style={styles.subTripLabel}>FEATURE TRIP</Text>
                </View>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <View style={styles.titleContainerItem}>
                <Ionicons name="ios-mail" size={26} color="white" />
              </View>

              <View style={styles.titleContainerItem}>
                <Text style={styles.title}>Invitations</Text>
              </View>
            </View>
            {/* <View style={styles.titleContainer}>
              <Text style={styles.title}>Yours invitations:</Text>
            </View> */}
            <View style={styles.flatListContainer}>
              <FlatList
                horizontal={true}
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
                        console.log(itemData);
                        setSelectedMember(itemData.item.id);
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
                      <Card style={styles.cartItem}>
                        <View style={styles.contentContainer}>
                          <View style={styles.LeftContentContainer}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-around",
                              }}
                            >
                              <View style={styles.tripNameContainer}>
                                <Text style={styles.tripName}>
                                  WYJAZD PO SESJI
                                </Text>
                              </View>
                              <View style={styles.tripNameContainer}>
                                <Text style={styles.senderName}>
                                  From: Szymon Gruszczynski
                                </Text>
                              </View>

                              <View style={styles.receivedDateContainer}>
                                <Text style={styles.receivedDate}>
                                  Received: 14.11.2020
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.RightContentContainer}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                              }}
                            >
                              <Ionicons
                                name="ios-checkmark-circle-outline"
                                size={40}
                                color="#4cd964"
                              />
                              <Ionicons
                                name="ios-close-circle-outline"
                                size={40}
                                color="#ff3b30"
                              />
                            </View>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

userProfileScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "User profile",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-settings"
          onPress={submitFn}
          //TO DO: save or edit Task

          // navData.navigation.goBack();
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    // marginTop: 30,
    justifyContent: "center",
    // borderColor: "red",
    // borderWidth: 1,
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
    width: "92.5%",

    justifyContent: "center",
    paddingBottom: 10,
    borderBottomColor: "#999999",
    borderBottomWidth: 0.5,

    // borderColor: "blue",
    // borderWidth: 1,
    // alignContent
  },
  titleContainerItem: {
    // flex: 1,
    justifyContent: "center",
    // borderColor: "blue",
    // borderWidth: 1,
  },
  title: {
    // textTransform: "uppercase",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    // margin: 30,
    color: "white",
    paddingLeft: 10,
    // marginBottom: 10,
  },
  label: {
    // textTransform: "uppercase",
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    // margin: 20,
    color: "white",
    alignSelf: "center",
  },
  subLabel: {
    // textTransform: "uppercase",
    fontSize: 12,
    margin: 10,
    color: "grey",
    alignSelf: "center",
  },
  fullName: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1,
    // margin: 30,
    color: "white",
  },
  input: { color: "#F2F2F7" },
  inputStyle: { color: "#F2F2F7" },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    // paddingTop: 10,
    // borderColor: "green",
    // borderWidth: 2,
  },
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
    // justifyContent: "flex-start",
    // alignItems: "stretch",
    // alignContent: "stretch",
    marginHorizontal: 20,
    marginTop: 20,
    height: 150,
    // maxWidth
    width: Dimensions.get("screen").width, // flex: 1,
    // flexDirection: "row",
  },

  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    minHeight: 130,
  },
  LeftContentContainer: {
    width: "80%",
  },
  senderName: {
    // color: "white",
    fontSize: 16,
    color: "#999999",
  },
  tripName: {
    fontSize: 24,
    color: "white",
  },
  receivedDate: {
    fontSize: 16,
    color: "#999999",
    // color: "white",
  },
  RightContentContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,

    justifyContent: "center",
    alignContent: "center",
  },
  flatListContainer: {
    width: "100%",
    flex: 1,
    // paddingBottom: 85,
  },
  countersContiner: {
    flex: 1,
    width: "90%",
    flexDirection: "row",
    // alignContent: "space-between",
    justifyContent: "space-between",
    maxHeight: 100,
    paddingTop: 5,
    // borderColor: "red",
    // borderWidth: 2,
  },
  subCounterContainer: {
    flex: 1,
    // borderColor: "blue",
    // borderWidth: 2,
  },
  subCounterTop: {
    // borderColor: "orange",
    // borderWidth: 2,
    alignItems: "center",
  },
  subCounterBottom: {
    // borderColor: "white",
    // borderWidth: 2,
    alignItems: "center",
  },
  mainCounterTop: {
    // borderColor: "orange",
    // borderWidth: 2,
    alignItems: "center",
    // borderLeftColor: "#999999",
    // borderLeftWidth: 1,
    // borderRightColor: "#999999",
    // borderRightWidth: 1,
  },
  mainCounterBottom: {
    // borderColor: "white",
    // borderWidth: 2,
    alignItems: "center",
    // borderLeftColor: "#999999",
    // borderLeftWidth: 1,
    // borderRightColor: "#999999",
    // borderRightWidth: 1,
  },
  activeTripsCounter: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  activeTripsLabel: {
    fontSize: 20,
    color: "white",

    textAlign: "center",
    // fontFamily: "poppins-regular",
    // fontWeight: "bold",
  },
  subTripCounter: {
    paddingTop: 40,
    fontSize: 20,
    color: "#999999",
    // fontWeight: "bold",
  },
  subTripLabel: {
    fontSize: 15,
    color: "#999999",

    textAlign: "center",
  },
});

export default userProfileScreen;
