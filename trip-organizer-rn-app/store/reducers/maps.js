import {
  GET_NEARBY_PLACES,
  CLEAR_NEARBY_PLACES,
  SET_SPECIFIC_MARKER,
} from "../actions/maps";
const initialState = {
  nearbyPlaces: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SPECIFIC_MARKER:
      return {
        nearbyPlaces: [
          {
            lat: action.data.latitude,
            lng: action.data.longitude,
            name: action.data.name,
            address: action.data.SET_SPECIFIC_MARKERvicinity,
          },
        ],
      };
    case GET_NEARBY_PLACES:
      //   console.log("REDUCER");
      //   console.log(action.nearbyPlaces);
      return {
        ...state,
        nearbyPlaces: action.nearbyPlaces,
      };
    case CLEAR_NEARBY_PLACES:
      return {
        ...state,
        nearbyPlaces: [],
      };
    default:
      return state;
  }
};
