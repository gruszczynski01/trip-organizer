import React from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

const nightStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];

const mapTabScreen = (props) => {
  return (
    <View style={styles.screen}>
      <MapView
        provider="google"
        customMapStyle={nightStyle}
        style={styles.map}
        initialRegion={{
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
          latitude: 52.397739118118444,
          longitude: 20.93465173962045,
        }}
      >
        <View style={styles.searchContainer}>
          {/* <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            query={{
              key: "YOUR API KEY",
              language: "en",
            }}
          /> */}
        </View>
        <View style={styles.quickActionContainer}>
          <View style={styles.circle}>
            <Ionicons name="ios-cafe" size={42} color="grey" />
          </View>
          <View style={styles.circle}>
            <Ionicons name="ios-restaurant" size={42} color="grey" />
          </View>
          <View style={styles.circle}>
            <Ionicons name="ios-cash" size={42} color="grey" />
          </View>
          <View style={styles.circle}>
            <Ionicons name="ios-bus" size={42} color="grey" />
          </View>
        </View>
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    width: "90%",
    height: 60,
    backgroundColor: "#2C2C2E",
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 45,
  },
  quickActionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 80,

    width: "90%",
    height: 80,

    // backgroundColor: "#2C2C2E",
    // borderColor: "grey",
    // borderWidth: 0.5,
    // borderRadius: 45,
  },
  circle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    maxWidth: 70,
    maxHeight: 70,
    borderRadius: 70 / 2,
    borderColor: "grey",
    borderWidth: 0.6,
    margin: 10,
    marginLeft: 4,
    backgroundColor: "#2C2C2E",
  },
  map: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // flexDirection: "column-reverse",
    paddingBottom: 95,
    paddingTop: 50,
  },

  screen: {
    flex: 1,
    backgroundColor: "#2C2C2E",
  },
});

mapTabScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Map",
  };
};

export default mapTabScreen;
