import { GET_SEARCHED_USERS } from "../actions/users";

const initialState = {
  searchedUser: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCHED_USERS:
      return {
        ...state,
        searchedUser: action.searchedUser,
      };
    default:
      return state;
  }
};
