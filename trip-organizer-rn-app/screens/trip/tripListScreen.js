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
} from "react-native";
import Card from "../../components/technical/Card";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/technical/HeaderButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import Moment from "moment";

import * as Animatable from "react-native-animatable";
import * as tripActions from "../../store/actions/trips";

const tripListScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const trips = useSelector((state) => state.trips.userTrips);
  const dispatch = useDispatch();

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

  const loadTrips = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(tripActions.getTrips());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadTrips);

    return () => {
      willFocusSub.remove();
    };
  }, [loadTrips]);

  useEffect(() => {
    setIsLoading(true);
    loadTrips().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadTrips]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Text>{error}</Text>
        <Button title="Try again" onPress={loadTrips} color="red" />
      </View>
    );
  }

  if (!isLoading && trips.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No trips found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        onRefresh={loadTrips}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadTrips}
            tintColor="#F2F2F7"
          />
        }
        refreshing={isRefreshing}
        data={trips}
        bounces={true}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("MainMenu", {
                trip: itemData.item,
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
                <Animatable.Text style={styles.title}>
                  {itemData.item.name}
                </Animatable.Text>
                <Text style={styles.dateText}>
                  {Moment(itemData.item.tripBeginning)
                    // .utcOffset(-1)
                    .format("DD.MM.YYYY")}{" "}
                  -{" "}
                  {Moment(itemData.item.tripEnding)
                    // .utcOffset(-1)
                    .format("DD.MM.YYYY")}
                </Text>
                <Text style={styles.destination}>
                  {itemData.item.destination}
                </Text>
              </Card>
            </Animatable.View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

tripListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Trips",
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
    backgroundColor: "#2C2C2E",
    // paddingBottom: 85,
  },
  cartItem: {
    padding: 10,
    backgroundColor: "black",
    // flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 20,
    marginTop: 20,
    minHeight: 100,
    flex: 1,
    flexDirection: "column",
  },
  title: {
    // textTransform: "uppercase",
    fontSize: 19,
    // fontWeight: "bold",
    letterSpacing: 1,
    padding: 5,
    color: "white",
  },
  dateText: {
    fontSize: 13,
    letterSpacing: 1,
    padding: 5,
    color: "#F2F2F7",
  },
  destination: {
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#F2F2F7",
  },
});

export default tripListScreen;
