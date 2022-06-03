import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {initializeApp} from "firebase/app";
import "firebase/compat/firestore";
import CloudStorageProvider from "storage/CloudStorageProvider";
import {BrowserRouter} from "react-router-dom";
import LocalStorageProvider from "storage/LocalStorageProvider";
import {NodeTransitionProvider} from "./storage/NodeTransitionProvider";
import {AuthProvider} from "auth/AuthProvider";
import {getFirestore} from "@firebase/firestore";
import {getAuth} from "@firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <LocalStorageProvider>
                    <CloudStorageProvider>
                        <NodeTransitionProvider>
                            <App/>
                        </NodeTransitionProvider>
                    </CloudStorageProvider>
                </LocalStorageProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
