import {
  ADD_EVENT,
  EDIT_EVENT,
  GET_TRIP_EVENTS,
  DELETE_EVENT,
} from "../actions/events";
import Event from "../../models/event";

const initialState = {
  tripEvents: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT:
      const newEvent = new Event(
        action.eventData.name,
        action.eventData.desc,
        action.eventData.date,
        action.eventData.time,
        action.eventData.tripParent
      );
      return {
        tripEvents: state.tripEvents.concat(newEvent),
      };
    case GET_TRIP_EVENTS:
      return {
        tripEvents: action.tripEvents,
      };
    default:
      return state;
  }
};
