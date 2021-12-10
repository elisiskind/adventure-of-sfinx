import React, {useEffect, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Fade} from 'components/Fade';
import {Space} from "components/Space";
import {Stars} from "components/Stars";
import {green} from "theme";
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
  },
  prompt: {
    fontSize: 20,
    animation: 'textShadow 1.6s infinite',
  },
  field: {
    display: 'flex',
    alignItems: 'start',
    padding: '20px',
    background: green[2],
    borderRadius: 20,
    marginRight: 20,
  },
  formField: {
    fontSize: 20,
    outline: 'none',
    border: 'none',
    background: 'none',
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
    paddingLeft: 10,
    width: '50px',
  },
  coordinatesContainer: {
    position: 'relative',
  },
  coordinatesDisplay: {
    position: 'absolute',
    top: 20,
    left: 20,
    textAlign: 'left',
    fontSize: 30,
    zIndex: 3,
  },
  controlsContainer: {
    position: 'relative',
    bottom: '0%',
    transition: 'bottom 0.5s ease-in-out'
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: "calc((100% - 394px) / 2)",
    margin: '0 auto',
    background: 'black',
    display: 'flex',
    border: '1px ' + green[6] + ' solid',
    borderBottom: 'none',
    borderRadius: '20px 20px 0 0',
    padding: '20px',
  },
  controlsHidden: {
    bottom: '-100%'
  }
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

interface SpaceshipProps {
  showControls: boolean;
  coordinates: string;
  updateCoordinates: (coordinates: string) => void;
  onWarp?: () => void;
  afterWarp?: () => void;
}

export const Spaceship = ({showControls, onWarp, afterWarp, coordinates, updateCoordinates}: SpaceshipProps) => {
  const classes = useStyles();

  const [warp, setWarp] = useState<boolean>(false);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(true);
  const [nextCoordinates, setNextCoordinates] = useState<string>('');


  const go = (nextCoordinates: string) => {
    setWarp(true);
    onWarp?.();
    setTimeout(() => {
      afterWarp?.();
      setNextCoordinates('');
      setWarp(false)
      updateCoordinates(nextCoordinates);
    }, 3000);
  }

  return (
      <>
        <div className={classes.screen}>
          <div className={classes.coordinatesContainer}>
          <div className={classes.coordinatesDisplay}>
            <Fade id={!warp} updateChild={(show) => {setShowCoordinates(show)}}>
              {showCoordinates ? <>CURRENT COORDINATES: {coordinates}</> : <></>}
            </Fade>
          </div>
          </div>
          <SpaceshipView warp={warp}/>
          <div
              className={showControls ? classes.controlsContainer : `${classes.controlsContainer} ${classes.controlsHidden}`}>
            <div className={classes.controls}>
              <div className={classes.field}>
                <span className={classes.prompt}>
                Coordinates:
                </span>
                <input
                    id={'search_username'}
                    type="text"
                    value={nextCoordinates}
                    onChange={(e) => setNextCoordinates(e.target.value.toUpperCase().substring(0, 2))}
                    className={classes.formField}
                    autoComplete="off"
                />
              </div>
              <Button onClick={() => go('A3')}>
                Go
              </Button>
            </div>
          </div>
        </div>
      </>
  );
}

