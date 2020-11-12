import {
  ADD_TASK,
  EDIT_TASK,
  GET_TRIP_TASKS,
  DELETE_TASK,
} from "../actions/tasks";
import Task from "../../models/task";

const initialState = {
  toDoListTasks: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      const newTask = new Task(
        action.taskData.name,
        action.taskData.description,
        action.taskData.ifDone,
        action.taskData.owner,
        action.taskData.toDoListParent
      );
      return {
        ...state,
        toDoListTasks: state.toDoListTasks.concat(newTask),
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
        toDoListTasks: state.toDoListTasks.filter(
          (task) => task.id !== action.taskId
        ),
      };
    default:
      return state;
  }
};
