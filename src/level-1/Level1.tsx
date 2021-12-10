import React, {useState} from 'react';
import "styles/crt.css";
import "styles/stars.sass"
import {Crt} from "components/Crt";
import {TextAdventure, TextGame} from "components/TextAdventure";
import {Spaceship} from "components/Spaceship";

export const Level1 = () => {

  const game: TextGame = {
    start: {
      prompt: '"Welcome to your space ship, ' + process.env.REACT_APP_CHARACTER_NAME + '"',
      options: [
        ['thanks', '"Thank you"'],
        ['who_speaking', '"Who is speaking?"'],
      ]
    },
    thanks: {
      prompt: '"Well, of course! Who wants a space ship that doesn\'t even welcome you aboard! Now, where are we off to today?"',
      options: [
        ['not_sure', '"I\'m not sure..."'],
        ['coordinates', '"I have the coordinates right here."'],
      ]
    },
    who_speaking: {
      prompt: '"It\'s your space ship, silly Sfinx!! Now, where are we off to today?"',
      options: [
        ['not_sure', '"I\'m not sure..."'],
        ['coordinates', '"I have the coordinates right here."'],
      ]
    },
    not_sure: {
      prompt: '"Well, it\'s certainly a big galaxy out there! Let me know when you know where you want to go."',
      options: [
        ['coordinates', '"Ok, I\'m ready now!"'],
      ]
    },
    coordinates: {
      prompt: '"I can\'t wait for another adventure!"',
      options: [],
      onSelect: () => setShowControls(true)
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

