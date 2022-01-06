import React, {useContext, useEffect, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Fade} from 'components/Fade';
import {Space} from "game/Space";
import {Stars} from "game/Stars";
import {green} from "theme";
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {History} from "components/History";
import {GeigerCounter} from "game/GeigerCounter";
import {GameGraph} from "game/Nodes";

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    height: '70%',
    transition: 'height 0.3s ease-in-out',
    animation: '1s ease-out 0s 1 expand',
    gap: 32,
    padding: '0 60px',
    overflow: 'hidden'
  },
  hidden: {
    height: '0% !important'
  },
  screen: {
    border: "2px solid " + green[6],
    borderRadius: 16,
    background: "black",
  },
  windshield: {
    flex: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  sidebar: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  geigerCounter: {
    padding: 16
  },
  history: {
    flex: 1,
    padding: 16
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    fontSize: 20,
    gap: 16
  },
})

interface SpaceshipViewProps {
  warp: boolean;
}

const SpaceshipView = ({warp}: SpaceshipViewProps) => {
  const [currentView, setCurrentView] = useState<'stars' | 'zoom'>('stars');
  const [nextView, setNextView] = useState<'stars' | 'zoom'>('stars');

  useEffect(() => {
    setNextView(warp ? 'zoom' : 'stars');
  }, [warp]);

  return (
      <Fade id={nextView} updateChild={(id: 'stars' | 'zoom') => {
        setCurrentView(id)
      }}>
        {(currentView === 'stars') ? <Stars/> : <Space/>}
      </Fade>
  );
}


export const Spaceship = () => {
  const classes = useStyles();

  const {warp, nodeId} = useContext(CloudStorageContext);
  const show = GameGraph[nodeId].showSpaceship;

  return (
      <div className={`${classes.root}${show ? '' : ' ' + classes.hidden}`}>
        <div className={`${classes.sidebar}`}>
          <div className={`${classes.history} ${classes.screen}`}>
            <History warp={warp}/>
          </div>
          <div className={`${classes.geigerCounter} ${classes.screen}`}>
            <GeigerCounter/>
          </div>
        </div>
        <div className={`${classes.windshield} ${classes.screen}`}>
          <SpaceshipView warp={warp}/>
        </div>
      </div>
  );
}

