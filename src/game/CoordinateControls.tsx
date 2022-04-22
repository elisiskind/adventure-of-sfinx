import * as React from 'react';
import {ChangeEvent, useCallback, useContext, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Button} from 'components/Button';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {green} from "theme";
import {Coordinates, validateCoordinatesAsYouType} from "game/Coordinates";
import {NodeTransitionContext} from "storage/NodeTransitionProvider";

const useStyles = createUseStyles({
  root: {
    display: 'flex'
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
    padding: '1px 2px 1px 8px',
    width: 48,
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
  },
  prompt: {
    fontSize: 20,
    animation: 'textShadow 1.6s infinite',
  }
});


export const CoordinateController = () => {
  const classes = useStyles();

  const {coordinates, update} = useContext(CloudStorageContext);

  const {updateNodeId, node} = useContext(NodeTransitionContext);
  const [nextCoordinates, setNextCoordinates] = useState<string>('');


  const enableButton = nextCoordinates.length === 2;

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    if (validateCoordinatesAsYouType(input)) {
      setNextCoordinates(input)
    }
  }


  const validateCoordinates = (targetCoordinates: string, currentCoordinates: string) => {
    const target = new Coordinates(targetCoordinates);
    const current = new Coordinates(currentCoordinates);
    return target.equals(current.next()) || target.equals(current.previous());
  }

  const go = useCallback((nextCoordinates: string) => {
    update({warp: true}).then(() => {
      setNextCoordinates('');
      setTimeout(() => {
        try {
          if (validateCoordinates(nextCoordinates, coordinates)) {
            if (node.travelInfo?.success) {
              updateNodeId(node.travelInfo.success, {coordinates: nextCoordinates});
            }
          } else {
            if (node.travelInfo) {
              updateNodeId(node.travelInfo.failure);
            }
          }
        } catch (e) {
          console.error('Error updating coordinates', e);
        }
      }, 6700);
    })
  }, [node.travelInfo, coordinates, updateNodeId, update])


  return (
      <div className={classes.root}>
        <div className={classes.field}>
                <span className={classes.prompt}>
                Coords:
                </span>
          <input
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
  );
};