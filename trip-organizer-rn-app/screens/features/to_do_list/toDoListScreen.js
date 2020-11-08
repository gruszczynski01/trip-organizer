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
} from "react-native";
import Card from "../../../components/technical/Card";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import Moment from "moment";
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

  const longPressHandler = (trip) => {
    Alert.alert(trip.name, "What do you want to do with?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("Deleting");
          console.log(trip);
          dispatch(tripActions.deleteTrip(trip.id));
        },
      },
      {
        text: "Edit",
        style: "default",
        onPress: () => {
          console.log("Editing");
          props.navigation.navigate("TripDestination", {
            trip: trip,
          });
        },
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("Editing");
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
          <Text style={styles.destination}>Tylko moje zadania</Text>
        </View>
        <View style={styles.filterContainerItem}>
          <Switch
            // trackColor={{ false: "#767577", true: "#81b0ff" }}
            // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <FlatList
        onRefresh={loadTasks}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadTasks}
            tintColor="#F2F2F7"
          />
        }
        refreshing={isRefreshing}
        data={tasks}
        extraData={refresh}
        bounces={true}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
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
            <Animatable.View
              animation="bounceInLeft"
              iterationCount={1}
              easing="linear"
            >
              <Card style={styles.cartItem}>
                <View style={styles.checkmarkContainer}>
                  <Ionicons
                    name={
                      itemData.item.ifDone === true
                        ? "ios-checkmark-circle"
                        : "ios-checkmark-circle-outline"
                    }
                    size={32}
                    color={itemData.item.ifDone === true ? "#39ff14" : "red"}
                    onPress={() => {
                      itemData.item.ifDone = !itemData.item.ifDone;
                    }}
                  />
                </View>
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
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.destination}>SZYMON GRUSZCZYŃSKI</Text>
                  </View>

                  {itemData.item.showDetails && (
                    <View
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
                      <Text style={styles.destination}>
                        Desciption: {itemData.item.description}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            </Animatable.View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

toDoListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "To do list",
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
          // iconName={isEditMode ? "ios-save" : "ios-add"}
          iconName="ios-add-circle-outline"
          onPress={() => {
            navData.navigation.navigate("TripDestination", { trip: -1 });
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
  nameContainer: {
    flex: 1,
    // flexWrap: "wrap",
    // flexShrink: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    padding: 5,
    color: "white",
    // borderColor: "red",
    // borderWidth: 2,
    borderBottomColor: "blue",
    borderBottomWidth: 2,
  },
  dateText: {
    fontSize: 17,
    letterSpacing: 1,
    padding: 5,
    color: "#F2F2F7",
  },
  destination: {
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#F2F2F7",
  },
});

export default toDoListScreen;
