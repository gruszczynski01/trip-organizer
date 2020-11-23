import {
  ADD_INVITATION,
  ACCEPT_INVITATION,
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
    case GET_USER_INVITATIONS:
      return {
        ...state,
        userInvitations: action.userInvitations,
      };
    case DELETE_INVITATION:
      return {
        ...state,
        userInvitations: state.userInvitations.filter(
          (invitation) => invitation.id !== action.invitationId
        ),
      };
    case ACCEPT_INVITATION:
      return {
        ...state,
        userInvitations: state.userInvitations.filter(
          (invitation) => invitation.id !== action.invitationId
        ),
      };
    default:
      return state;
  }
};
