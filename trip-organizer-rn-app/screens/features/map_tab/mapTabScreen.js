import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";
import { CLEAR_NEARBY_PLACES } from "../../../store/actions/maps";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import * as mapsActions from "../../../store/actions/maps";
import * as Location from "expo-location";

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
  const [isCafe, setIsCafe] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isAtm, setIsAtm] = useState(false);
  const [isTransitStation, setIsTransitStation] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState();
  const [region, setRegion] = useState({
    latitude: 52.25635143608742,
    longitude: 20.898964122145777,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  });
  let currentRegion = region;
  const nearbyPlaces = useSelector((state) => state.maps.nearbyPlaces);

  const dispatch = useDispatch();
  let mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = parseFloat(JSON.stringify(position.coords.latitude));
        const longitude = parseFloat(JSON.stringify(position.coords.longitude));

        setRegion({
          ...region,
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        });
        setIsLoading(false);
        // mapRef.current.animateToRegion(region, 1000);
      },
      (error) => alert(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#2C2C2E",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ color: "white", marginTop: 20 }}>
          User tracking is in progress...
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <Animatable.View
        style={styles.screen}
        animation="fadeInUp"
        easing="ease-out"
        iterationCount={1}
      >
        <MapView
          ref={(ref) => {
            mapRef = ref;
          }}
          showsUserLocation={true}
          // followUserLocation={true}
          // zoomEnabled={true}
          provider={PROVIDER_GOOGLE}
          customMapStyle={nightStyle}
          style={styles.mapDefault}
          initialRegion={{
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
            ...region,
          }}
          region={region}
          // ref={(ref) => (this.mapView = ref)}
          onRegionChange={(curr) => {
            currentRegion = curr;
          }}
          onRegionChangeComplete={(curr) => {
            currentRegion = curr;
          }}
        >
          {nearbyPlaces.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
              title={marker.name}
              description={marker.address}
            />
          ))}
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
            <TouchableOpacity
              onPress={() => {
                if (!isCafe) {
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  dispatch(
                    mapsActions.getNearbyPlaces(
                      "cafe",
                      2000,
                      currentRegion.latitude,
                      currentRegion.longitude
                    )
                  );
                  setIsCafe(!isCafe);
                  setIsRestaurant(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                } else {
                  dispatch({ type: CLEAR_NEARBY_PLACES });
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  setIsCafe(false);
                  setIsRestaurant(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                }
              }}
            >
              <View style={styles.circle}>
                <Ionicons
                  style={{ paddingLeft: 3 }}
                  name="ios-cafe"
                  size={42}
                  color={isCafe ? "#147efb" : "grey"}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!isRestaurant) {
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  dispatch(
                    mapsActions.getNearbyPlaces(
                      "restaurant",
                      2000,
                      currentRegion.latitude,
                      currentRegion.longitude
                    )
                  );
                  setIsRestaurant(!isRestaurant);
                  setIsCafe(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                } else {
                  dispatch({ type: CLEAR_NEARBY_PLACES });
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  setIsCafe(false);
                  setIsRestaurant(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                }
              }}
            >
              <View style={styles.circle}>
                <Ionicons
                  name="ios-restaurant"
                  size={42}
                  color={isRestaurant ? "#147efb" : "grey"}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!isAtm) {
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  dispatch(
                    mapsActions.getNearbyPlaces(
                      "atm",
                      2000,
                      currentRegion.latitude,
                      currentRegion.longitude
                    )
                  );
                  setIsAtm(!isAtm);
                  setIsRestaurant(false);
                  setIsCafe(false);
                  setIsTransitStation(false);
                } else {
                  dispatch({ type: CLEAR_NEARBY_PLACES });
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  setIsCafe(false);
                  setIsRestaurant(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                }
              }}
            >
              <View style={styles.circle}>
                <FontAwesome
                  name="dollar"
                  size={42}
                  color={isAtm ? "#147efb" : "grey"}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                if (!isTransitStation) {
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  dispatch(
                    mapsActions.getNearbyPlaces(
                      "transit_station",
                      2000,
                      currentRegion.latitude,
                      currentRegion.longitude
                    )
                  );
                  setIsTransitStation(!isTransitStation);
                  setIsRestaurant(false);
                  setIsCafe(false);
                  setIsAtm(false);
                } else {
                  dispatch({ type: CLEAR_NEARBY_PLACES });
                  setRegion({
                    ...region,
                    ...currentRegion,
                  });
                  setIsCafe(false);
                  setIsRestaurant(false);
                  setIsAtm(false);
                  setIsTransitStation(false);
                }
              }}
            >
              <Ionicons
                name="ios-bus"
                size={42}
                color={isTransitStation ? "#147efb" : "grey"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* </View> */}
        {/* </MapView> */}
      </Animatable.View>
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
  },
  quickActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",

    maxHeight: 80,

    // width: "100%",
    // height: 80,
    // paddingVertical: 30,

    // backgroundColor: "#2C2C2E",
    // borderColor: "grey",
    // borderWidth: 0.5,
    // borderRadius: 45,
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
