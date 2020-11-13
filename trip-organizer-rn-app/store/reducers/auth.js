import { AUTHENTICATE, LOGOUT, SAVE_USER } from "../actions/auth";

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
    case LOGOUT:
      initialState;

    default:
      return state;
  }
};
