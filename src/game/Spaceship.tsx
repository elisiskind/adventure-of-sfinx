import React, {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Fade} from 'components/Fade';
import {Space} from "game/Space";
import {Stars} from "game/Stars";
import {green} from "theme";
import {Button} from "components/Button";
import {Coordinates, validateCoordinatesAsYouType} from "game/Coordinates";
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {GameGraph} from "game/Nodes";
import {NodeTransitionContext} from "storage/NodeTransitionProvider";
import {History} from "components/History";

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    height: '70%',
    transition: 'height 0.3s ease-in-out',
    animation: '1s ease-out 0s 1 expand',
    gap: 64,
    padding: '0 60px'
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
  history: {
    flex: 1
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    fontSize: 20,
    gap: 16
  },
  prompt: {
    fontSize: 20,
    animation: 'textShadow 1.6s infinite',
  },
  field: {
    display: 'flex',
    alignItems: 'start',
    padding: 16,
    background: green[2],
    borderRadius: 16,
    marginRight: 16,
  },
  formField: {
    fontSize: 20,
    outline: 'none',
    border: 'none',
    background: 'none',
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
    paddingLeft: 8,
    width: 48,
  },
  coordinatesContainer: {
    position: 'relative',
  },
  coordinatesDisplay: {
    position: 'absolute',
    top: 16,
    left: 16,
    textAlign: 'left',
    fontSize: 24,
    zIndex: 3,
  },
  controlsContainer: {
    position: 'relative',
    top: '0%',
    transition: 'top 0.5s ease-in-out'
  },
  controls: {
    position: "absolute",
    top: 0,
    left: "calc((100% - 394px) / 2)",
    margin: '0 auto',
    background: 'black',
    display: 'flex',
    border: '1px ' + green[6] + ' solid',
    borderTop: 'none',
    borderRadius: '0 0 16px 16px',
    padding: 16,
  },
  controlsHidden: {
    top: '-100%'
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

const validateCoordinates = (targetCoordinates: string, currentCoordinates: string) => {
  const target = new Coordinates(targetCoordinates);
  const current = new Coordinates(currentCoordinates);
  return target.equals(current.next()) || target.equals(current.previous());
}

export const Spaceship = () => {
  const classes = useStyles();

  const {coordinates, warp, mutations: {updateCoordinates, updateField}} = useContext(CloudStorageContext);

  const {nodeId, updateNodeId} = useContext(NodeTransitionContext);
  const [nextCoordinates, setNextCoordinates] = useState<string>('');
  const [warpSound] = useState(new Audio('/sound/warp.wav'));

  const enableButton = nextCoordinates.length === 2;

  const node = GameGraph[nodeId]

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {
      htmlElRef.current && (htmlElRef.current as any)?.focus?.()
    }
    return [htmlElRef, setFocus]
  }

  const go = useCallback((nextCoordinates: string) => {
    updateField(BooleanField.WARP, true).then(() => {
      warpSound.play();
      setNextCoordinates('');
      setTimeout(() => {
        try {
          if (validateCoordinates(nextCoordinates, coordinates)) {
            updateCoordinates(nextCoordinates);
            if (node.travelInfo?.success) {
              updateNodeId(node.travelInfo.success);
            }
          } else {
            if (node.travelInfo) {
              updateNodeId(node.travelInfo.failure);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    })
  }, [node.travelInfo, coordinates, updateCoordinates, updateNodeId, warpSound])

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    if (validateCoordinatesAsYouType(input)) {
      setNextCoordinates(input)
    }
  }

  const [inputRef, setInputFocus] = useFocus()

  useEffect(() => {
    if (node.travelInfo) {
      const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && enableButton && !warp) {
          go(nextCoordinates);
        }
      }
      document.addEventListener("keydown", handleKeypress);
      return () => {
        document.removeEventListener('keydown', handleKeypress);
      }
    }
  }, [nextCoordinates, go, enableButton, warp, node.travelInfo])

  if (node.travelInfo) {
    if (typeof setInputFocus === 'function') {
      console.log('setting focus');
      setInputFocus();
    }
  }

  return (
      <div className={classes.root}>
        <div className={`${classes.history} ${classes.screen}`}>
          <History warp={warp}/>
        </div>
        <div className={`${classes.windshield} ${classes.screen}`}>
          <div
              className={node.travelInfo && !warp ? classes.controlsContainer : `${classes.controlsContainer} ${classes.controlsHidden}`}>
            <div className={classes.controls}>
              <div className={classes.field}>
                <span className={classes.prompt}>
                Coordinates:
                </span>
                <input
                    ref={inputRef}
                    autoFocus={!!node.travelInfo}
                    disabled={!node.travelInfo}
                    id={'search_username'}
                    type="text"
                    value={nextCoordinates}
                    onChange={handleTyping}
                    className={classes.formField}
                    autoComplete="off"
                />
              </div>
              <Button onClick={() => go(nextCoordinates)} disabled={!enableButton}>
                Go
              </Button>
            </div>
          </div>
          <SpaceshipView warp={warp}/>

        </div>
      </div>
  );
}

