import { GET_SEARCHED_USERS } from "../actions/users";

const initialState = {
  searchedUsers: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCHED_USERS:
      // console.log("REDUCER:");
      // console.log(action);
      return {
        //...state,
        searchedUsers: action.searchedUsers,
      };
    default:
      return state;
  }
};
