import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import Reducers from "./store/Reducers";
import Navigation from "./navigation/Navigation";
import "react-native-gesture-handler";
import { firebase } from "@firebase/app";

const rootReducer = combineReducers({
  Info: Reducers,
});

const store = createStore(rootReducer);

const firebaseConfig = {
  apiKey: "AIzaSyDdqoP5gY_BnRlOnYjdxZ1vGSgZWpO4XLU",
  authDomain: "mytest-a9e6c.firebaseapp.com",
  projectId: "mytest-a9e6c",
  storageBucket: "mytest-a9e6c.appspot.com",
  messagingSenderId: "876007608120",
  appId: "1:876007608120:web:f5641ef3116419dfbe3bcd",
  measurementId: "G-4Y2N40JVF1",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
