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
      let tmpToDoListTasks = state.toDoListTasks;
      tmpToDoListTasks.forEach(function (task, index, array) {
        if (task.id == action.taskData.id) {
          array[index] = {
            ...task,
            name: action.taskData.name,
            description: action.taskData.description,
            owner: action.taskData.owner,
            ifDone: action.taskData.ifDone,
          };
        }
      });
      return {
        ...state,
        toDoListTasks: tmpToDoListTasks,
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
