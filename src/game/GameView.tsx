import React, {useContext} from 'react';
import "styles/crt.css";
import "styles/stars.sass"
import {Crt} from "components/Crt";
import {TextAdventure} from "game/TextAdventure";
import {Spaceship} from "game/Spaceship";
import {CloudStorageContext} from "storage/CloudStorageProvider";


export const GameView = () => {

  const {failed} = useContext(CloudStorageContext);

  return (
      <>
        <Crt flashRed={failed}>
          <Spaceship/>
          <div>
            <TextAdventure/>
          </div>
        </Crt>
      </>
  );
}

