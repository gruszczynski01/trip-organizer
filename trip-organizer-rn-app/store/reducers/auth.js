import { AUTHENTICATE, LOGOUT, SAVE_USER, EDIT_USER } from "../actions/auth";

const initialState = {
  token: null,
  userId: null,
  loggedUser: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
      };
    case SAVE_USER:
      console.log("SAVE USER REDUCER");
      console.log(action.loggedUser);

      return {
        ...state,
        loggedUser: action.loggedUser,
      };
    case EDIT_USER:
      console.log("UPDATE USER REDUCER");
      console.log(action.editedUser);
      console.log("END");

      return {
        ...state,
        loggedUser: action.editedUser,
      };
    case LOGOUT:
      initialState;

    default:
      return state;
  }
};
