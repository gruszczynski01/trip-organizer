import { GET_RATES } from "../actions/currencies";

const initialState = {
  base: null,
  rates: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_RATES:
      console.log("REDUCER:");
      console.log(action.rates);
      return {
        // ...state,
        base: action.base,
        rates: action.rates,
      };
    default:
      return state;
  }
};
