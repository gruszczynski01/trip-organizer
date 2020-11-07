import {
  ADD_TASK,
  EDIT_TASK,
  GET_TRIP_TASKS,
  DELETE_TASK,
} from "../actions/tasks";
import Event from "../../models/event";

const initialState = {
  toDoListTasks: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
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
    case EDIT_TASK:
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
    case GET_TRIP_TASKS:
      return {
        toDoListTasks: action.toDoListTasks,
      };
    case DELETE_TASK:
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
