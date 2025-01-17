export const GET_NEARBY_PLACES = "GET_NEARBY_PLACES";
export const CLEAR_NEARBY_PLACES = "CLEAR_NEARBY_PLACES";
export const SET_SPECIFIC_MARKER = "SET_SPECIFIC_MARKER";

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
          //   let ifWebsite = false;
          //   let website = "";
          //   fetch(
          //     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_MAP_API_KEY}`
          //   )
          //     .then((response) => response.json())
          //     .then((json) => {
          //       if (json.hasOwnProperty("website")) {
          //         ifWebsite = true;
          //         website = json.website;
          //       }
          //     });
          nearbyPlaces.push({
            place_id: place.place_id,
            name: place.name,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            open_now:
              "opening_hours" in place
                ? place.opening_hours.open_now
                : "No info",
            address: place.vicinity,
            rating: place.rating,
            reviews: place.user_ratings_total,
            ifImage: place.hasOwnProperty("photos") ? true : false,
            image: place.hasOwnProperty("photos")
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAP_API_KEY}`
              : "",
            // ifWebsite: ifWebsite,
            // website: ifWebsite ? website : "",
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

// export const getWebsiteLink = (placeId) => {
//   return async (dispatch, getState) => {
//     let nearbyPlaces = [];

//     await fetch(
//       `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_API_KEY}`
//     )
//       .then((response) => response.json())
//       .then((json) => {
//         if (json.hasOwnProperty("website")) {
//           return json.website;
//         } else {
//           return "";
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
// };
