import React, {useState} from 'react';
import "styles/crt.css";
import "styles/stars.sass"
import {Crt} from "components/Crt";
import {TextAdventure, TextGame} from "components/TextAdventure";
import {Spaceship} from "components/Spaceship";

export const Level2 = () => {
  const game: TextGame = {
    start: {
      prompt: '"Hi, I am Gravlax and I am actually good! The code to open the box is 785."',
      options: [
        ['thanks', '"Thank you"'],
        ['thanks', '"Well this feels a bit too easy..."'],
      ]
    },
    thanks: {
      prompt: '"Oh sure, couldn\'t make this too complicated since Eli is just making sure it works!"',
      options: [
        ['coordinates', '"Hmmm..."'],
        ['coordinates', '"I guess that makes sense...?"'],
        ['coordinates', '"Well, you are the expert!"'],
      ]
    },
    coordinates: {
      prompt: '"Next, you\'ll have to get to A4."',
      options: [],
      onSelect: () => {
        console.log('Hello')
        setShowControls(true)
      }
    }
  };

  const [coordinates, setCoordinates] = useState<string>('A7');
  const [nodeId, setNodeId] = useState<string>('start');
  const [showControls, setShowControls] = useState<boolean>(false);

  return (
      <>
        <Crt>
          <Spaceship showControls={showControls}
                     onWarp={() => setShowControls(false)}
                     afterWarp={() => setShowControls(true)}
                     coordinates={coordinates}
                     updateCoordinates={setCoordinates}
          />
          <div>
            <TextAdventure game={game} currentNodeId={nodeId} updateNode={setNodeId}/>
          </div>
        </Crt>
      </>
  );
}

