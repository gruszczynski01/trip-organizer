import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";

import authReducer from "./store/reducers/auth";
import eventsReducer from "./store/reducers/events";
import tasksReducer from "./store/reducers/tasks";
import toDoListReducer from "./store/reducers/toDoList";
import tripsReducer from "./store/reducers/trips";
import usersReducer from "./store/reducers/users";
import invitationsReducer from "./store/reducers/invitations";
import currenciesReducer from "./store/reducers/currencies";
import mapsReducer from "./store/reducers/maps";
import NavigationContainer from "./navigation/NavigationContainer";

// firebase.auth().onAuthStateChanged((user) => {
//   if (user != null) {
//     console.log("We are authenticated now!");
//   }

//   // Do other things
// });

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  toDoList: toDoListReducer,
  trips: tripsReducer,
  users: usersReducer,
  invitations: invitationsReducer,
  currencies: currenciesReducer,
  maps: mapsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
