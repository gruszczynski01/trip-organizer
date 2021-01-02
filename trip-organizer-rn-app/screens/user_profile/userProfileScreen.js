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
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../components/technical/Card";
import { Avatar, Accessory } from "react-native-elements";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/technical/HeaderButton";

import * as invitationActions from "../../store/actions/invitations";
import Moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const userProfileScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const userInvitations = useSelector(
    (state) => state.invitations.userInvitations
  );
  const userTrips = useSelector((state) => state.trips.userTrips);
  const loggedUser = useSelector((state) => state.auth.loggedUser);

  const submitHandler = useCallback(async () => {
    // var body = {
    //   ...props.navigation.state.params,
    //   name: formState.inputValues.name,
    //   description: formState.inputValues.desc,
    //   owner: selectedMember,
    // };

    // console.log("DEBUG: SUBMIT HANDLER");
    // console.log(body);

    // // // console.log(formState.inputValues.name);
    // // console.log(formState.inputValues.desc);
    // // console.log(Moment(props.navigation.state.params.).format("DD-MM-YYYY"));
    // // console.log(Moment(date).format("HH:mm"));

    // // const dispatch = useDispatch();

    // if (!!editedTask) {
    //   await dispatch(
    //     taskActions.editTask(
    //       editedTask.id,
    //       formState.inputValues.name,
    //       formState.inputValues.desc,
    //       editedTask.ifDone,
    //       selectedMember
    //     )
    //   );
    // } else {
    //   await dispatch(
    //     taskActions.addTask(
    //       formState.inputValues.name,
    //       formState.inputValues.desc,
    //       false,
    //       selectedMember,
    //       trip.to_do_list
    //     )
    //   );
    // }
    console.log("EDIT USER");
    props.navigation.navigate("EditUserProfile", {
      loggedUser: loggedUser,
    });
  }, [dispatch]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  // trip members

  const loadUserInvitations = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(invitationActions.getUserInvitations());
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    console.log(userInvitations);

    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadUserInvitations
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadUserInvitations]);

  useEffect(() => {
    setIsLoading(true);
    loadUserInvitations().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadUserInvitations]);

  const acceptInvitation = () => {
    Alert.alert("", "You've been successfully added to the trip 🎉", [
      {
        text: "Okay",
        style: "default",
      },
    ]);
  };
  const declineInvitation = (invitation) => {
    Alert.alert("", "Are you shure?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "cancel",
        onPress: () => {
          console.log(invitation);

          dispatch(invitationActions.deleteInvitation(invitation));
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.screen}>
        {/* <ScrollView> */}
        <View style={styles.mainContainer}>
          <View style={{ alignSelf: "center", paddingVertical: 20 }}>
            <Avatar
              source={{
                uri:
                  "https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/102848904_3066354756813371_3616733500491375538_o.jpg?_nc_cat=105&ccb=2&_nc_sid=09cbfe&_nc_ohc=bylMH2n5I6cAX8PQ-FR&_nc_ht=scontent-waw1-1.xx&oh=ca2fb75922f27b4302d1413872cae694&oe=6010639E",
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
            <Text style={styles.label}>
              {loggedUser.name} {loggedUser.surname}
            </Text>
            <Text style={styles.subLabel}>{loggedUser.email}</Text>
            <View style={styles.countersContiner}>
              <View style={styles.subCounterContainer}>
                <View style={styles.subCounterTop}>
                  <Text style={styles.subTripCounter}>
                    {
                      userTrips.filter(
                        (trip) =>
                          Date.now() >= new Date(trip.tripEnding).getTime()
                      ).length
                    }
                  </Text>
                </View>
                <View style={styles.subCounterBottom}>
                  <Text style={styles.subTripLabel}>PAST TRIP</Text>
                </View>
              </View>

              <View style={styles.subCounterContainer}>
                <View style={styles.mainCounterTop}>
                  <Text style={styles.activeTripsCounter}>
                    {userTrips.length}
                  </Text>
                </View>
                <View style={styles.mainCounterBottom}>
                  <Text style={styles.activeTripsLabel}>TRIPS TOTAL</Text>
                </View>
              </View>

              <View style={styles.subCounterContainer}>
                <View style={styles.subCounterTop}>
                  <Text style={styles.subTripCounter}>
                    {
                      userTrips.filter(
                        (trip) =>
                          Date.now() < new Date(trip.tripEnding).getTime()
                      ).length
                    }
                  </Text>
                </View>
                <View style={styles.subCounterBottom}>
                  <Text style={styles.subTripLabel}>FUTURE TRIP</Text>
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
                onRefresh={loadUserInvitations}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={loadUserInvitations}
                    tintColor="#F2F2F7"
                  />
                }
                refreshing={isRefreshing}
                data={userInvitations}
                bounces={true}
                keyExtractor={(item) => item.id}
                renderItem={(itemData) => (
                  <View>
                    <View>
                      <Card style={styles.cartItem}>
                        <View style={styles.contentContainer}>
                          <TouchableWithoutFeedback
                            style={styles.LeftContentContainer}
                          >
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-around",
                              }}
                            >
                              <View style={styles.tripNameContainer}>
                                <Text style={styles.tripName}>
                                  {itemData.item.tripName}
                                </Text>
                              </View>
                              <View style={styles.receivedDateContainer}>
                                <Text style={styles.receivedDate}>
                                  Received:{" "}
                                  {Moment(
                                    Date(itemData.item.sendTimestamp)
                                  ).format("DD.MM.YYYY")}
                                </Text>
                              </View>
                              <View style={styles.tripNameContainer}>
                                <Text style={styles.senderName}>
                                  From: {itemData.item.senderName}
                                </Text>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                          <View style={styles.RightContentContainer}>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  acceptInvitation();
                                  dispatch(
                                    invitationActions.acceptInvitation(
                                      itemData.item
                                    )
                                  );
                                  //dorobic tutaj odsiwerzanie state o tripach
                                }}
                              >
                                <Ionicons
                                  name="ios-checkmark-circle-outline"
                                  size={40}
                                  color="#4cd964"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  declineInvitation(itemData.item);
                                }}
                              >
                                <Ionicons
                                  name="ios-close-circle-outline"
                                  size={40}
                                  color="#ff3b30"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Card>
                    </View>
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
          title="Edit user"
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
    paddingTop: 20,
    paddingBottom: 10,
    // borderColor: "blue",
    // borderWidth: 1,
  },
  title: {
    // textTransform: "uppercase",
    fontSize: 19,
    // fontWeight: "bold",
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
    marginTop: 30,
    height: 150,
    // maxWidth
    width: Dimensions.get("screen").width * 0.75, // flex: 1,
    // borderColor: 'orange',
    // borderWidth: 0.9,
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
    width: "75%",
    paddingLeft: 5,
  },
  senderName: {
    // color: "white",
    fontSize: 13,
    color: "#999999",
  },
  tripName: {
    fontSize: 19,
    color: "white",
    // paddingTop: 5,
    // paddingBottom: 20,
  },
  receivedDate: {
    fontSize: 13,
    color: "#999999",
    // color: "white",
  },
  RightContentContainer: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "#999999",
    borderLeftWidth: 0.5,
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
    justifyContent: "center",
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
    justifyContent: "center",
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
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  activeTripsLabel: {
    fontSize: 15,
    color: "white",

    textAlign: "center",
    // fontFamily: "poppins-regular",
    // fontWeight: "bold",
  },
  subTripCounter: {
    paddingTop: 40,
    fontSize: 17,
    color: "#999999",
    // fontWeight: "bold",
  },
  subTripLabel: {
    fontSize: 12,
    color: "#999999",

    textAlign: "center",
  },
});

export default userProfileScreen;
