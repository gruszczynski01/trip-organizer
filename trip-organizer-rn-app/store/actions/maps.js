export const GET_NEARBY_PLACES = "GET_NEARBY_PLACES";
export const CLEAR_NEARBY_PLACES = "CLEAR_NEARBY_PLACES";
import { GOOGLE_MAP_API_KEY } from "../../constants/constants";
import { auth, database } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";

// import trips from "../reducers/trips";

export const getNearbyPlaces = (type, radius, lat, lng) => {
  return async (dispatch, getState) => {
    let nearbyPlaces = [];

    await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_MAP_API_KEY}`
    )
      .then((response) => response.json())
      .then((json) => {
        rates = json.results;
        rates.forEach((place) => {
          nearbyPlaces.push({
            name: place.name,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            open_now:
              "opening_hours" in place
                ? place.opening_hours.open_now
                : "No info",
            address: place.vicinity,
            rating: place.rating,
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });

    dispatch({
      type: GET_NEARBY_PLACES,
      nearbyPlaces: nearbyPlaces,
    });
  };
};
