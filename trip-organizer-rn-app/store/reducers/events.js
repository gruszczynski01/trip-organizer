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
    case EDIT_EVENT:
      let tmpTripEvents = state.tripEvents;
      tmpTripEvents.forEach(function (event, index, array) {
        if (event.id == action.eventData.id) {
          array[index] = {
            ...event,
            title: action.eventData.eventName,
            description: action.eventData.eventDesc,
            date: action.eventData.eventDate,
            time: action.eventData.time,
          };
        }
      });
      return {
        ...state,
        tripEvents: tmpTripEvents,
      };
    case GET_TRIP_EVENTS:
      return {
        tripEvents: action.tripEvents,
      };
    case DELETE_EVENT:
      return {
        //...state,
        tripEvents: state.tripEvents.filter(
          (event) => event.id !== action.eventId
        ),
      };
    default:
      return state;
  }
};
