// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {auth} from "../index";
import {GoogleAuthProvider} from "firebase/auth";
import {createUseStyles} from "react-jss";
import {Crt} from "../components/Crt";

const useStyles = createUseStyles({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: '100vh',
        width: '100vw'
    },
    screen: {
        borderRadius: 16,
        maxWidth: 720,
        border: "2px solid #Af7",
        background: "black",
        animation: "1s ease-out 0s 1 expand",
        marginBottom: '30%',
        padding: 36
    }
})

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
    ],
};

export const Login = () => {

    const classes = useStyles();

    return (
        <Crt>
            <div className={classes.root}>
                <div className={classes.screen}>
                    <h3>Sign in or create an account to continue:</h3>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
                </div>
            </div>
        </Crt>
    );
}
