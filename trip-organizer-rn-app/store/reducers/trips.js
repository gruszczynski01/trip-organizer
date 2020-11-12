import Trip from "../../models/trip";
import {
  ADD_TRIP,
  EDIT_TRIP,
  GET_USER_TRIP,
  DELETE_TRIP,
  GET_TRIP_MEMBERS,
} from "../actions/trips";

const initialState = {
  userTrips: [],
  tripMembers: [],
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
        ...state,
        userTrips: state.userTrips.concat(newTrip),
      };
    case EDIT_TRIP:
      let tmpUserTrips = state.userTrips;
      tmpUserTrips.forEach(function (trip, index, array) {
        if (trip.id == action.tripData.id) {
          array[index] = {
            ...trip,
            name: action.tripData.name,
            destination: action.tripData.destination,
            tripBeginning: action.tripData.tripBeginning,
            tripEnding: action.tripData.tripEnding,
          };
        }
      });
      return {
        ...state,
        userTrips: tmpUserTrips,
      };
    case GET_USER_TRIP:
      return {
        ...state,
        userTrips: action.tripsData,
      };
    case DELETE_TRIP:
      return {
        ...state,
        userTrips: state.userTrips.filter((trip) => trip.id !== action.tripId),
      };
    case GET_TRIP_MEMBERS:
      return {
        ...state,
        // userTrips: state.userTrips,
        tripMembers: action.tripMembers,
      };
    default:
      return state;
  }
};
