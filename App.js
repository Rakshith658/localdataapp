import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import Reducers from "./store/Reducers";
import Navigation from "./navigation/Navigation";
import "react-native-gesture-handler";

const rootReducer = combineReducers({
  Info: Reducers,
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
