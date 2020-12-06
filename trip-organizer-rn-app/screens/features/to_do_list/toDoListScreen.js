import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Alert,
  RefreshControl,
  Button,
  Switch,
  TouchableHighlight,
} from "react-native";
import Card from "../../../components/technical/Card";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import * as taskActions from "../../../store/actions/tasks";

const toDoListScreen = (props) => {
  const trip = props.navigation.getParam("trip");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState();
  const tasks = useSelector((state) => state.tasks.toDoListTasks);
  const loggedUserId = useSelector((state) => state.auth.userId);
  let userTasks = tasks.filter((task) => {
    task.owner == loggedUserId;
  });
  let tasksToFlatlist = tasks;

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  // setState({
  //   data: [
  //     ...this.state.data.slice(0, i),
  //     Object.assign({}, this.state.data[i], { quantity: item.quantity + 1 }),
  //     ...this.state.data.slice(i + 1)
  //   ]
  // });

  const longPressHandler = (task) => {
    Alert.alert(task.name, "What do you want to do with?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("Deleting");
          console.log(task);

          dispatch(taskActions.deleteTask(task.id, task.toDoListParent));
        },
      },
      {
        text: "Edit",
        style: "default",
        onPress: () => {
          console.log("Editing");
          props.navigation.navigate("EditTask", {
            trip: trip,
            task: task,
          });
        },
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("Cancel alert");
        },
      },
    ]);
  };

  const loadTasks = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(taskActions.getTasks(trip.to_do_list));
    } catch (err) {
      setError(err.message);
    }
    setData();
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadTasks);

    return () => {
      willFocusSub.remove();
    };
  }, [loadTasks]);

  useEffect(() => {
    setIsLoading(true);
    loadTasks().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadTasks]);

  useEffect(() => {
    tasks.sort(compareTasks);
  }, [tasks]);

  useEffect(() => {
    tasksToFlatlist = userTasks;
  }, [isEnabled]);

  function compareTasks(a, b) {
    if (a.ifDone == false && b.ifDone == true) {
      return -1;
    }
    if (a.ifDone == true && b.ifDone == false) {
      return 1;
    }
    return 0;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Text>{error}</Text>
        <Button title="Try again" onPress={loadTasks} color="red" />
      </View>
    );
  }

  if (!isLoading && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No tasks found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.filterContainer}>
        <View style={styles.filterContainerItem}>
          <Text style={styles.switchLabel}>Only my tasks</Text>
        </View>
        <View style={styles.filterContainerItem}>
          <Switch
            // trackColor={{ false: "#767577", true: "#81b0ff" }}
            // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            //onValueChange={toggleSwitch}
            value={isEnabled}
            onValueChange={() => {
              toggleSwitch();
              setRefresh(!refresh);
            }}
          />
        </View>
      </View>
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 85 }}
          onRefresh={loadTasks}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={loadTasks}
              tintColor="#F2F2F7"
            />
          }
          refreshing={isRefreshing}
          data={tasksToFlatlist}
          extraData={refresh}
          bounces={true}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <View>
              <Animatable.View
                animation="bounceInLeft"
                iterationCount={1}
                easing="linear"
              >
                {(!isEnabled || itemData.item.owner == loggedUserId) && (
                  <Card style={styles.cartItem}>
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
                            itemData.item.ifDone === true
                              ? "ios-checkmark-circle"
                              : "ios-radio-button-off"
                            // : "ios-checkmark-circle-outline"
                          }
                          size={32}
                          color={
                            itemData.item.ifDone === true ? "#00D84D" : "grey"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          console.log(itemData.item);
                          setRefresh(!refresh);
                          tasks.forEach((task) => {
                            if (task.id == itemData.item.id) {
                              task.showDetails = !task.showDetails;
                            }
                          });
                        }}
                        onLongPress={(trip) => {
                          // console.log("onLongPress: trip: ", itemData.item);
                          // setEditMode(true);
                          longPressHandler(itemData.item);
                        }}
                      >
                        <View style={styles.nameContainer}>
                          <Animatable.Text style={styles.title}>
                            {itemData.item.name}
                          </Animatable.Text>
                          <View
                            style={{
                              borderTopColor: "grey",
                              borderTopWidth: 1,

                              // paddingHorizontal: 5,
                              // marginHorizontal: 5,
                              width: "90%",
                              paddingTop: 10,
                              paddingBottom: 10,
                              // alignItems: "center",
                              alignContent: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={styles.ownerName}>
                              {itemData.item.ownerName}
                            </Text>
                          </View>

                          {itemData.item.showDetails && (
                            <Animatable.View
                              animation="flipInX"
                              iterationCount={1}
                              easing="linear"
                              style={{
                                borderTopColor: "grey",
                                borderTopWidth: 1,
                                width: "90%",

                                paddingTop: 10,
                                // alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text style={styles.description}>
                                {itemData.item.description}
                              </Text>
                            </Animatable.View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Card>
                )}
              </Animatable.View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

toDoListScreen.navigationOptions = (navData) => {
  const trip = navData.navigation.getParam("trip");

  return {
    headerTitle: "To do list",

    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          // iconName={isEditMode ? "ios-save" : "ios-add"}
          iconName="ios-add-circle-outline"
          onPress={() => {
            navData.navigation.navigate("EditTask", { trip: trip, task: -1 });
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    justifyContent: "flex-start",
  },
  filterContainer: {
    flex: 1,
    height: 30,
    maxHeight: 50,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    // alignItems: "flex-start",
    justifyContent: "space-between",
    alignContent: "space-around",
  },
  filterContainerItem: {
    alignSelf: "center",
    paddingHorizontal: 25,
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
    minHeight: 75,
    flex: 1,
    flexDirection: "row",
  },
  checkmarkContainer: {
    width: "15%",
    justifyContent: "center",
    alignContent: "center",
    paddingLeft: 3,
  },
  contentContainer: {
    width: "85%",
  },
  nameContainer: {
    flex: 1,
    // flexWrap: "wrap",
    // flexShrink: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    // textTransform: "uppercase",
    fontSize: 16,
    // fontWeight: "bold",
    letterSpacing: 1,
    padding: 5,
    color: "white",
    // borderColor: "red",
    // borderWidth: 2,
    borderBottomColor: "blue",
    borderBottomWidth: 2,
    flexWrap: "wrap",
    // width: "90%",
  },
  switchLabel: {
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#F2F2F7",
  },

  ownerName: {
    fontSize: 13,
    letterSpacing: 1,
    // fontWeight: "bold",
    paddingLeft: 5,
    color: "#F2F2F7",
  },
  description: {
    fontSize: 13,
    letterSpacing: 1,
    //fontWeight: "",
    paddingLeft: 5,
    color: "#9e9e9e",
  },

  container: {
    flex: 1,
    paddingTop: 20,
  },
  listItem: {
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default toDoListScreen;
