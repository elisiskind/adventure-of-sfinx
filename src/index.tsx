import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import CloudStorageProvider from "storage/CloudStorageProvider";
import { BrowserRouter } from "react-router-dom";
import LocalStorageProvider from "storage/LocalStorageProvider";
import { NodeTransitionProvider } from "./storage/NodeTransitionProvider";
import { Coordinates } from "./game/Coordinates";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

const start = new Coordinates("1D");
let coordinates = start;
console.log(`Coordinates:  ${coordinates.toString()}`);
do {
  coordinates = coordinates.previous();
  console.log(`Coordinates:  ${coordinates.toString()}`);
} while (!coordinates.equals(start));

console.warn("OTHER DIRECTION");
coordinates = start;
console.log(`Coordinates:  ${coordinates.toString()}`);
do {
  coordinates = coordinates.next();
  console.log(`Coordinates:  ${coordinates.toString()}`);
} while (!coordinates.equals(start));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalStorageProvider>
        <CloudStorageProvider>
          <NodeTransitionProvider>
            <App />
          </NodeTransitionProvider>
        </CloudStorageProvider>
      </LocalStorageProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
