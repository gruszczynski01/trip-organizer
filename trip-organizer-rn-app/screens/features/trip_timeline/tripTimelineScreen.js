import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Timeline from "react-native-timeline-flatlist";
import HorizontalDatePicker from "@logisticinfotech/react-native-horizontal-date-picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/technical/HeaderButton";
import * as eventActions from "../../../store/actions/events";

const tripTimelineScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [error, setError] = useState();
  const events = useSelector((state) => state.events.tripEvents);
  let dayEvents = events.filter((elem) => {
    elem.date == date;
  });
  const dispatch = useDispatch();

  const trip = props.navigation.getParam("trip");
  const [date, setDate] = useState(new Date(trip.tripBeginning));
  const [data, setData] = useState([]);

  useEffect(() => {
    props.navigation.setParams({ trip: trip });
  }, [trip]);

  useEffect(() => {
    setData(events.filter((elem) => elem.date == date).sort(compareEvents));
  }, [date, events]);

  onDateSelected = (date) => {
    console.log("Selected Date:==>", date);
    setDate(date);
  };

  function compareEvents(a, b) {
    if (
      new Date().setHours(a.time.substr(0, 2), a.time.substr(3), 0, 0) <
      new Date().setHours(b.time.substr(0, 2), b.time.substr(3), 0, 0)
    ) {
      return -1;
    }
    if (
      new Date().setHours(a.time.substr(0, 2), a.time.substr(3), 0, 0) >
      new Date().setHours(b.time.substr(0, 2), b.time.substr(3), 0, 0)
    ) {
      return 1;
    }
    return 0;
  }

  const loadEvents = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(eventActions.getEvents(trip.id));
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadEvents);

    return () => {
      willFocusSub.remove();
    };
  }, [loadEvents]);

  useEffect(() => {
    setIsLoading(true);
    loadEvents().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadEvents]);

  const pressHandler = (event) => {
    Alert.alert(event.title, "What do you want to do with?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          console.log("Deleting");

          dispatch(eventActions.deleteEvent(event.id, trip.id));
        },
      },
      {
        text: "Edit",
        style: "default",
        onPress: () => {
          props.navigation.navigate("EventTime", {
            event: event,
            trip: trip,
          });
        },
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("Canceling");
        },
      },
    ]);
  };
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Text>{error}</Text>
        <Button title="Try again" onPress={loadEvents} color="red" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text></Text>
      <View style={styles.datePickerContainer}>
        <HorizontalDatePicker
          minDate={new Date(trip.tripBeginning)}
          maxDate={new Date(trip.tripEnding)}
          style={styles.datePicker}
          pickerType={"date"}
          onDateSelected={onDateSelected}
          isShowYear={true}
        />
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <Timeline
          style={styles.list}
          data={data}
          separator={true}
          circleSize={20}
          onEventPress={(event) => {
            pressHandler(event);
          }}
          circleColor="orange"
          lineColor="grey"
          timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
          timeStyle={{
            textAlign: "center",
            backgroundColor: "#147efb",
            color: "white",
            padding: 5,
            borderRadius: 13,
            overflow: "hidden",
          }}
          titleStyle={{ color: "white" }}
          descriptionStyle={{ color: "gray" }}
          options={{
            refreshControl: (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={loadEvents}
              />
            ),
            style: { paddingTop: 5 },
          }}
        />
      )}
    </View>
  );
};

tripTimelineScreen.navigationOptions = (navData) => {
  const trip = navData.navigation.getParam("trip");

  return {
    headerTitle: "Timeline",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          buttonStyle={{ color: "#147efb" }}
          title="Add"
          iconName="ios-add-circle-outline"
          onPress={() => {
            navData.navigation.navigate("EventTime", { trip: trip, event: -1 });
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  datePickerContainer: {
    paddingBottom: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 2,
  },
  container: {
    flex: 1,
    padding: 20,
    //paddingTop: 65,
    backgroundColor: "#2C2C2E",
  },
  list: {
    flex: 1,
    paddingTop: 5,
    // marginTop: 3,
  },
  datePicker: {
    width: "100%",
  },
});
export default tripTimelineScreen;
