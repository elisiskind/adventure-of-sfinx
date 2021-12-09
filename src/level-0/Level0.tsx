import React, {useContext} from 'react';
import "styles/crt.css";
import {MailDrop} from "components/MailDrop";
import {IntroMessage} from "level-0/IntroMessage";
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {LocalStorageContext} from "storage/LocalStorageProvider";


export const Level0 = () => {

  const {mailDrop1LoggedIn, mutations: {setField}} = useContext(CloudStorageContext);
  const {loggedIn, mutations: {login}} = useContext(LocalStorageContext);

  return (
      <MailDrop username={process.env.REACT_APP_L1_USERNAME!}
                password={process.env.REACT_APP_L1_PASSWORD!}
                dropId={'H740'}
                message={IntroMessage}
                loggedIn={mailDrop1LoggedIn && loggedIn}
                onLogin={(guest) => {
                  setField(BooleanField.MAIL_DROP_1_LOGGED_IN, true);
                  login(guest);
                }}
      />
  );
}

