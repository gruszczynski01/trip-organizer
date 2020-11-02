import Trip from "../../models/trip";
import {
  ADD_TRIP,
  EDIT_TRIP,
  GET_USER_TRIP,
  DELETE_TRIP,
} from "../actions/trips";

const initialState = {
  userTrips: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TRIP:
      const newTrip = new Trip(
        action.tripData.owner,
        action.tripData.name,
        action.tripData.destination,
        action.tripData.tripBeginning,
        action.tripData.tripEnding,
        action.tripData.toDoList
      );
      return {
        //...state,
        userTrips: state.userTrips.concat(newTrip),
      };
    case EDIT_TRIP:
      return {
        token: action.token,
        userId: action.userId,
      };
    case GET_USER_TRIP:
      return {
        userTrips: action.tripsData,
      };
    case DELETE_TRIP:
      return {
        //...state,
        userTrips: state.userTrips.filter((trip) => trip.id !== action.tripId),
      };
    default:
      return state;
  }
};
