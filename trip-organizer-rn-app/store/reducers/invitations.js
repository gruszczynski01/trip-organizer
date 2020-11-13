import {
  ADD_INVITATION,
  EDIT_INVITATION,
  GET_USER_INVITATIONS,
  DELETE_INVITATION,
} from "../actions/invitations";
import Invitation from "../../models/invitation";

const initialState = {
  userInvitations: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVITATION:
      const newInvitation = new Invitation(
        action.invitationData.trip,
        action.invitationData.tripName,
        action.invitationData.sender,
        action.invitationData.senderName,
        action.invitationData.receiver,
        action.invitationData.sendTimestamp
      );
      return {
        ...state,
        userInvitations: state.userInvitations.concat(newInvitation),
      };
    case EDIT_INVITATION:
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
    case GET_USER_INVITATIONS:
      return {
        toDoListTasks: action.toDoListTasks,
      };
    case DELETE_INVITATION:
      return {
        ...state,
        toDoListTasks: state.toDoListTasks.filter(
          (task) => task.id !== action.taskId
        ),
      };
    default:
      return state;
  }
};
