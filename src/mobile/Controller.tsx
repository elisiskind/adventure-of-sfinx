import * as React from 'react';
import {useContext} from 'react';
import {createUseStyles} from "react-jss";
import {Crt} from "components/Crt";
import {Gauge} from "components/Gauge";
import {Button} from 'components/Button';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {green} from "theme";
import {CoordinateController} from "game/CoordinateControls";
import {NodeTransitionContext} from "storage/NodeTransitionProvider";

const useStyles = createUseStyles({
  root: {
    height: '100%',
    width: 'calc(100% - 40px)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    animation: '1s ease-out 0s 1 expand',
  },
  contained: {
    borderRadius: 16,
    border: "1px solid " + green[6],
  },
  row: {
    display: 'flex',
    gap: 16,
    flexDirection: 'row',
  },
  divider: {
    width: '100%',
    height: 0,
    borderBottom: "1px solid " + green[2],
  },
  column: {
    gap: 16,
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  },
  hidden: {
    height: '0px !important',
    border: 'none',
    overflow: "hidden",
    padding: 0
  },
  controls: {
    height: 57,
    transition: 'height 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out',
  }
});


export const Controller = () => {
  const classes = useStyles();

  const {
    mutations: {updateLevel},
    mission,
    mailDrop2Unlocked,
    shipUnlocked,
    warp,
  } = useContext(CloudStorageContext);

  const {node} = useContext(NodeTransitionContext);

  const showCoordinates = !!node.travelInfo;

  return (
      <Crt>
        <div className={classes.root}>
          <div
              className={classes.column + ' ' + classes.contained + ' ' + classes.controls + (showCoordinates ? '' : ' ' + classes.hidden)}>
            <CoordinateController/>
          </div>
          <div className={classes.column + ' ' + classes.contained}>
            Engines
            <div className={classes.row}>
              <Gauge on={warp} label={'Port Thruster'}/>
              <Gauge on={warp} label={'Starboard Thruster'}/>
            </div>
          </div>
          <Button onClick={() => updateLevel(0)}>
            Mail drop {process.env.REACT_APP_MD1_CODE}
          </Button>
          {mailDrop2Unlocked && <Button onClick={() => updateLevel(2)}>
              Mail drop {process.env.REACT_APP_MD2_CODE}
          </Button>}
          {shipUnlocked && <Button onClick={() => updateLevel(1)}>
              Back to ship
          </Button>}
          {mission && <div>
              Mission: {mission}
          </div>}
        </div>

      </Crt>
  );
};