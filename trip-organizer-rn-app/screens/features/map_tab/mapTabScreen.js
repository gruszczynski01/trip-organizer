import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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

const test = async () => {
  await fetch(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=52.397739118118444,20.93465173962045&radius=1000&type=transit_station&key=AIzaSyCxT6eS-PINCpaufv-_qPQarL2_YOGC2sw"
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.error(error);
    });
};

const mapTabScreen = (props) => {
  test();

  return (
    <View style={styles.screen}>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={nightStyle}
        style={styles.mapDefault}
        initialRegion={{
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
          latitude: 52.397739118118444,
          longitude: 20.93465173962045,
        }}
      >
        <Marker
          coordinate={{
            latitude: 52.397739118118444,
            longitude: 20.93465173962045,
          }}
        ></Marker>
      </MapView>
      {/* <View style={styles.map}> */}
      <View style={styles.searchContainer}>
        <View styles={styles.GooglePlacesAutocompleteContainer}>
          <GooglePlacesAutocomplete
            styles={{
              container: {
                flex: 1,
                // borderColor: "grey",
                // borderWidth: 1,
                // borderRadius: 5,
              },
              textInputContainer: {
                flexDirection: "row",
                color: "white",
              },
              textInput: {
                backgroundColor: "#4d4d4d",
                height: 44,
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontSize: 15,
                flex: 1,
                color: "white",
              },

              powered: {},
              listView: {},
              row: {
                backgroundColor: "#2C2C2E",
                padding: 13,
                height: 44,
                flexDirection: "row",
                color: "white",
              },
              separator: {
                height: 0.5,
                backgroundColor: "grey",
              },
              description: {
                color: "white",
              },
              loader: {
                flexDirection: "row",
                justifyContent: "flex-end",
                height: 20,
                paddingRight: 8,
              },
            }}
            currentLocation={true}
            placeholder="Search"
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
            }}
            enablePoweredByContainer={false}
            query={{
              key: "AIzaSyCxT6eS-PINCpaufv-_qPQarL2_YOGC2sw",
              language: "en",
            }}
          />
        </View>
      </View>
      <View style={styles.quickActionMainContainer}>
        <View style={styles.quickActionContainer}>
          <View style={styles.circle}>
            <Ionicons
              style={{ paddingLeft: 3 }}
              name="ios-cafe"
              size={42}
              color="grey"
            />
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
      </View>

      {/* </View> */}
      {/* </MapView> */}
    </View>
  );
};
const styles = StyleSheet.create({
  mapDefault: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    // flex: 1,
    // flexDirection: "column",
    position: "absolute",
    top: 70,
    left: 0,
    width: "100%",
    paddingHorizontal: 30,
  },
  quickActionMainContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    flex: 1,
    width: "100%",
    height: 80,
    paddingHorizontal: 20,
  },
  quickActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",

    maxHeight: 80,

    // width: "100%",
    // height: 80,
    // paddingVertical: 30,

    backgroundColor: "#2C2C2E",
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 45,
  },
  circle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    maxWidth: 65,
    maxHeight: 65,
    borderRadius: 65 / 2,
    borderColor: "grey",
    borderWidth: 0.6,
    marginVertical: 10,
    // marginLeft: 4,

    backgroundColor: "#2C2C2E",
  },

  screen: {
    ...StyleSheet.absoluteFillObject,
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
