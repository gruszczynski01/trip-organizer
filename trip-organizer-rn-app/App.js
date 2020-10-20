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
import NavigationContainer from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  toDoList: toDoListReducer,
  trips: tripsReducer,
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