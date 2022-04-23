import React, { useContext } from "react";
import "styles/crt.css";
import { MailDrop } from "components/MailDrop";
import { CloudStorageContext } from "storage/CloudStorageProvider";
import { MessageFromGorgo } from "mail-drop-2/MessageFromGorgo";

export const MailDrop2 = () => {
  const { mailDrop2LoggedIn, update } = useContext(CloudStorageContext);

  return (
    <MailDrop
      username={process.env.REACT_APP_MD2_USERNAME!}
      password={process.env.REACT_APP_MD2_PASSWORD!}
      dropId={process.env.REACT_APP_MD2_CODE!}
      message={MessageFromGorgo}
      loggedIn={mailDrop2LoggedIn}
      onLogin={() => {
        update({ mailDrop2LoggedIn: true });
      }}
    />
  );
};
