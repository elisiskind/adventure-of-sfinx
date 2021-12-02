import React from 'react';
import "styles/crt.css";
import {MailDrop} from "components/MailDrop";
import {IntroMessage} from "level-0/IntroMessage";


export const Level0 = () => {

  return (
      <MailDrop username={process.env.REACT_APP_L1_USERNAME!}
                password={process.env.REACT_APP_L1_PASSWORD!}
                dropId={'H740'}
                message={IntroMessage}
      />
  );
}

