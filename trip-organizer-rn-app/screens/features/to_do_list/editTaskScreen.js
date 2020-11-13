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
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/technical/Card";
import Input from "../../../components/technical/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import * as taskActions from "../../../store/actions/tasks";
import * as tripActions from "../../../store/actions/trips";
import Moment from "moment";
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

const editTaskScreen = (props) => {
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
  if (task != -1) {
    editedTask = useSelector((state) =>
      state.tasks.toDoListTasks.find((taskElem) => taskElem.id === task.id)
    );
  }

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
        <View style={styles.mainContainer}>
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <ScrollView>
                <Input
                  labelStyle={styles.input}
                  inputStyle={styles.inputStyle}
                  id="name"
                  label="Name"
                  keyboardType="default"
                  required
                  errorText="Please enter a valid name."
                  onInputChange={inputChangeHandler}
                  initialValue={editedTask ? editedTask.name : ""}
                  initiallyValid={!!editedTask}
                />

                <Input
                  labelStyle={styles.input}
                  inputStyle={styles.inputStyle}
                  style={styles.input}
                  id="desc"
                  label="Description"
                  keyboardType="default"
                  errorText="Please enter a valid description."
                  multiline={true}
                  umberOfLines={4}
                  onInputChange={inputChangeHandler}
                  initialValue={editedTask ? editedTask.description : ""}
                  initiallyValid={!!editedTask}
                />
              </ScrollView>
            </Card>
          </View>
          <View>
            <Text style={styles.title}>Choose the task's owner</Text>
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
                  {itemData.item.ifActive == 1 && (
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
                      <Card
                        style={{
                          ...styles.cartItem,
                          borderColor:
                            itemData.item.id == selectedMember
                              ? "#00D84D"
                              : "black",
                          borderWidth: 2,
                        }}
                      >
                        <View style={styles.contentContainer}>
                          <View>
                            <View style={styles.nameContainer}>
                              <Text style={styles.fullName}>
                                {itemData.item.name} {itemData.item.surname}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

editTaskScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");

  return {
    headerTitle: "Add new Task",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-save"
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
    marginTop: 30,
    // alignItems: "center",
  },

  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    // alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 25,
    fontWeight: "bold",
    letterSpacing: 1,
    margin: 30,
    color: "white",
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

export default editTaskScreen;
