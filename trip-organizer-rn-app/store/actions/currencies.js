import { AsyncStorage } from "react-native";
export const GET_RATES = "GET_RATES";

import { auth, database } from "../../firebase";

export const getRates = (base) => {
  return async (dispatch, getState) => {
    let rates = {};

    await fetch(`https://api.exchangeratesapi.io/latest?P&base=${base}`)
      .then((response) => response.json())
      .then((json) => {
        rates = json.rates;
        if (base == "EUR") {
          rates["EUR"] = 1;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    dispatch({
      type: GET_RATES,
      base: base,
      rates: rates,
    });
  };
};
