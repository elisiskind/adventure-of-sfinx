import React, {useEffect, useState} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import "styles/stars.sass"
import {Crt} from "components/Crt";
import {Fade} from 'components/Fade';
import {Space} from "components/Space";
import {Button} from "components/Button";

const useStyles = createUseStyles({

  screen: {
    borderRadius: 15,
    width: '60%',
    height: '70%',
    margin: '0 auto',
    border: "2px solid #Af7",
    background: "black",
    animation: '1s ease-out 0s 1 expand',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    fontSize: 20,
    gap: 20
  }
})

export const Level1 = () => {
  const classes = useStyles();

  const messages: Record<number, string> = {
    0: 'Well, good day there!',
    1: 'Welcome back to your ship, ' + process.env.REACT_APP_CHARACTER_NAME,
    2: 'It sure looks empty out there...',
    3: 'Where are we going today?'
  }

  const [currentId, setCurrentId] = useState<number>(0);
  const [nextId, setNextId] = useState<number>(0);

  const [currentView, setCurrentView] = useState<'stars' | 'zoom'>('stars');
  const [nextView, setNextView] = useState<'stars' | 'zoom'>('stars');

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => setNextId(i), i * 3000);
    }
  }, [])

  const content = () => {
    if (currentId >= 0 && currentId < 4) {
      return messages[currentId];
    } else if (currentId === 4) {
      return <div className={classes.message}>
        <div>
          COURSE SET FOR COORDINATES A4Z8
        </div>
        <div>
          <Button onClick={go}>
            Initiate route
          </Button>
        </div>
      </div>
    }
  }

  const go = () => {
    setNextView('zoom')
  }

  const view = () => {
    if (currentView === 'stars') {
      return <>
        <div id={'stars'}/>
        <div id={'stars2'}/>
        <div id={'stars3'}/>
      </>
    } else {
      return <Space/>
    }

  }

  return (
      <>
        <Crt>
          <div className={classes.screen}>
            <Fade id={nextView} updateChild={(id: 'stars' | 'zoom') => {
              setCurrentView(id)
            }}>
              {view()}
            </Fade>
          </div>
          <div className={classes.message}>
            <Fade id={nextId} updateChild={(id) => {
              setCurrentId(id)
            }}>
              {content()}
            </Fade>
          </div>
        </Crt>
      </>
  );
}

