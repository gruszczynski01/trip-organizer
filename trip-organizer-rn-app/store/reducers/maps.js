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
            ...action.data,
          },
        ],
      };
    case GET_NEARBY_PLACES:
      console.log("REDUCER");
      console.log(action.nearbyPlaces);
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
