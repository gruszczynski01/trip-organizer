import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";
import {
  CLEAR_NEARBY_PLACES,
  SET_SPECIFIC_MARKER,
} from "../../../store/actions/maps";
import { GOOGLE_MAP_API_KEY } from "../../../constants/constants";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  Platform,
  Linking,
  ImageBackground,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";

// import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";

import StarRating from "../../../components/technical/StarRating";

// import { TextInput } from "react-native-gesture-handler";
import * as mapsActions from "../../../store/actions/maps";
import * as Location from "expo-location";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 170;
export const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

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

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= nearbyPlaces.length) {
        index = nearbyPlaces.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const coordinate = {
            latitude: nearbyPlaces[index].lat,
            longitude: nearbyPlaces[index].lng,
          };
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  });

  const interpolations = nearbyPlaces.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });
  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const getWebsiteLink = (placeId) => {
    return async (dispatch, getState) => {
      await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website&key=${GOOGLE_MAP_API_KEY}`
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json.result.hasOwnProperty("website")) {
            Linking.openURL(json.result.website);
            // Linking.openURL("https://aboutreact.com");
          } else {
            Alert.alert("No website info, try to google it");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
  };

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

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);

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
          ref={_map}
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
          {nearbyPlaces.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: marker.lat,
                  longitude: marker.lng,
                }}
                onPress={(e) => onMarkerPress(e)}
              >
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.Image
                    source={require("../../../assets/icons/location-pin.png")}
                    style={[styles.marker, scaleStyle]}
                    resizeMode="cover"
                  />
                </Animated.View>
              </MapView.Marker>
            );
            // <Marker
            //   key={index}
            //   coordinate={{
            //     latitude: marker.lat,
            //     longitude: marker.lng,
            //   }}
            //   title={marker.name}
            //   description={marker.address}
            //   // image={require("../../../assets/icons/location-pin.png")}
            // />;
          })}
        </MapView>
        <Animated.ScrollView
          ref={_scrollView}
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={styles.scrollView}
          contentInset={{
            top: 0,
            left: SPACING_FOR_CARD_INSET,
            bottom: 0,
            right: SPACING_FOR_CARD_INSET,
          }}
          contentContainerStyle={{
            paddingHorizontal:
              Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: mapAnimation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
        >
          {nearbyPlaces.map((marker, index) => (
            <TouchableWithoutFeedback
              key={index}
              // style={{ backgroundColor: "#2C2C2E" }}
              onPress={() => {
                dispatch(getWebsiteLink(marker.place_id));
              }}
            >
              <View style={styles.card} key={index}>
                {marker.ifImage && (
                  <ImageBackground
                    source={{ uri: marker.image }} // DO ZMIANY!!!!!!!!
                    style={styles.cardImage}
                    resizeMode="cover"
                  >
                    {/* <View>
                    {marker.ifWebsite && (
                      <Foundation
                        style={{ padding: 6 }}
                        name="web"
                        size={40}
                        color="#147efb"
                      />
                    )}
                  </View> */}
                  </ImageBackground>
                )}

                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>
                    {marker.name}
                  </Text>
                  <StarRating
                    ratings={marker.rating}
                    reviews={marker.reviews}
                  />
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.address}
                  </Text>
                  {/* <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[
                      styles.signIn,
                      {
                        borderColor: "#FF6347",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: "#FF6347",
                        },
                      ]}
                    >
                      Order Now
                    </Text>
                  </TouchableOpacity>
                </View> */}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </Animated.ScrollView>
        {/* <View style={styles.map}> */}
        <View style={styles.searchContainer}>
          <View styles={styles.GooglePlacesAutocompleteContainer}>
            <GooglePlacesAutocomplete
              styles={{
                container: {
                  flex: 1,
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
              // currentLocation={true}
              placeholder="Search"
              enablePoweredByContainer={false}
              fetchDetails={true}
              query={{
                key: "AIzaSyCxT6eS-PINCpaufv-_qPQarL2_YOGC2sw",
                language: "en",
              }}
              onPress={(data, details) => {
                console.log(data);
                console.log(details);
                dispatch({
                  type: SET_SPECIFIC_MARKER,
                  data: {
                    place_id: data.place_id,
                    name: data.description,
                    lat: details.geometry.location.lat,
                    lng: details.geometry.location.lng,

                    address: details.formatted_address,
                    rating: details.rating,
                    reviews: details.user_ratings_total,
                    ifImage: details.hasOwnProperty("photos") ? true : false,
                    image: details.hasOwnProperty("photos")
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${details.photos[0].photo_reference}&key=${GOOGLE_MAP_API_KEY}`
                      : "",
                  },
                });
                setRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.025,
                  longitudeDelta: 0.025,
                });
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
                      1000,
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
                  size={25}
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
                  size={25}
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
                  size={25}
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
                size={25}
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
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#4d4d4d",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    marginBottom: 145,
  },
  cardImage: {
    flex: 3,
    flexDirection: "row-reverse",
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
    color: "white",
  },
  cardDescription: {
    fontSize: 12,
    color: "#ACACAC",
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: "center",
    marginTop: 5,
  },
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
    bottom: 80,
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
    width: 55,
    height: 55,
    maxWidth: 55,
    maxHeight: 55,
    borderRadius: 55 / 2,
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
