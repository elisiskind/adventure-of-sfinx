import React, {useContext} from 'react';
import "styles/crt.css";
import {MailDrop} from "components/MailDrop";
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {LocalStorageContext} from "storage/LocalStorageProvider";
import {MessageFromGorgo} from "mail-drop-2/MessageFromGorgo";


export const MailDrop2 = () => {
  const {mailDrop2LoggedIn, mutations: {updateField}} = useContext(CloudStorageContext);
  const {loggedIn} = useContext(LocalStorageContext);

  return (
      <MailDrop username={process.env.REACT_APP_MD2_USERNAME!}
                password={process.env.REACT_APP_MD2_PASSWORD!}
                dropId={process.env.REACT_APP_MD2_CODE!}
                message={MessageFromGorgo}
                loggedIn={mailDrop2LoggedIn && loggedIn}
                onLogin={() => {
                  updateField(BooleanField.MAIL_DROP_2_LOGGED_IN, true);
                }}
      />
  );
}

