import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import StorageProvider from "storage/StorageProvider";
import {BrowserRouter} from "react-router-dom";


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

/* Get the element you want displayed in fullscreen mode (a video in this example): */
const root = document.getElementById('root')
ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <StorageProvider>
          <App/>
        </StorageProvider>
      </BrowserRouter>
    </React.StrictMode>,
    root
);