import React, {useContext} from 'react';
import "styles/crt.css";
import "styles/stars.sass"
import {Crt} from "components/Crt";
import {TextAdventure} from "game/TextAdventure";
import {Spaceship} from "game/Spaceship";
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {NodeTransitionContext} from "../storage/NodeTransitionProvider";
import {MailDrop1} from "../mail-drop-1/MailDrop1";
import {MailDrop2} from "../mail-drop-2/MailDrop2";
import {Space} from "./Space";


export const GameView = () => {

  const {node: {failure}} = useContext(NodeTransitionContext);
  const {view} = useContext(CloudStorageContext);

  const adventureView = <>
    <Crt flashRed={failure}>
      <Spaceship/>
      <div>
        <TextAdventure/>
      </div>
    </Crt>
  </>

  if (failure) {
    return adventureView;
  }

  switch (view) {
    case 'mail-drop-1':
      return <MailDrop1/>;
    case 'ship':
      return adventureView;
    case 'mail-drop-2':
      return <MailDrop2/>;
    default:
      return <Space/>
  }
}

