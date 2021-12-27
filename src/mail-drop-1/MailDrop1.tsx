import React, {useContext} from 'react';
import "styles/crt.css";
import {MailDrop} from "components/MailDrop";
import {IntroMessage} from "mail-drop-1/IntroMessage";
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {LocalStorageContext} from "storage/LocalStorageProvider";


export const MailDrop1 = () => {

  const {mailDrop1LoggedIn, mutations: {updateField}} = useContext(CloudStorageContext);
  const {loggedIn, mutations: {login}} = useContext(LocalStorageContext);

  return (
      <MailDrop username={process.env.REACT_APP_MD1_USERNAME!}
                password={process.env.REACT_APP_MD1_PASSWORD!}
                dropId={process.env.REACT_APP_MD1_CODE!}
                message={IntroMessage}
                loggedIn={mailDrop1LoggedIn && loggedIn}
                onLogin={(guest) => {
                  updateField(BooleanField.MAIL_DROP_1_LOGGED_IN, true);
                  login(guest);
                }}
      />
  );
}

