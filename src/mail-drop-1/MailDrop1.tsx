import React, {useContext} from 'react';
import "styles/crt.css";
import {MailDrop} from "components/MailDrop";
import {IntroMessage} from "mail-drop-1/IntroMessage";
import {CloudStorageContext} from "storage/CloudStorageProvider";


export const MailDrop1 = () => {

  const {mailDrop1LoggedIn, update} = useContext(CloudStorageContext);

  return (
      <MailDrop username={process.env.REACT_APP_MD1_USERNAME!}
                password={process.env.REACT_APP_MD1_PASSWORD!}
                dropId={process.env.REACT_APP_MD1_CODE!}
                message={IntroMessage}
                loggedIn={mailDrop1LoggedIn}
                onLogin={() => {update({mailDrop1LoggedIn: true})}}
      />
  );
}

