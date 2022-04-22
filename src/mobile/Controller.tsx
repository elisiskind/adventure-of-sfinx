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
import {ControlContainer} from "./ControlContainer";

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
  engines: {
    height: 152,
    position: "relative",
    transition: 'height 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out',
  },
  controls: {
    height: 57,
    transition: 'height 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out',
  }
});


export const Controller = () => {
  const classes = useStyles();

  const {
    update,
    mission,
    mailDrop2Unlocked,
    shipUnlocked,
    warp,
    view
  } = useContext(CloudStorageContext);

  const {node} = useContext(NodeTransitionContext);

  const showShip = view === 'ship' && node.showSpaceship;
  const showCoordinates = !!node.travelInfo && showShip;

  return (
      <Crt>
        <div className={classes.root}>
          <ControlContainer height={57} hidden={!showCoordinates}>
            <CoordinateController/>
          </ControlContainer>
          <ControlContainer hidden={!showShip} height={152}>
            Engines
            <div className={classes.row}>
              <Gauge on={warp} label={'Port Thruster'}/>
              <Gauge on={warp} label={'Starboard Thruster'}/>
            </div>
          </ControlContainer>
          <Button disabled={view === 'mail-drop-1'} onClick={() => update({view: 'mail-drop-1'})}>
            Mail drop {process.env.REACT_APP_MD1_CODE}
          </Button>
          {mailDrop2Unlocked && <Button disabled={view === 'mail-drop-2'} onClick={() => update({view: 'mail-drop-2'})}>
              Mail drop {process.env.REACT_APP_MD2_CODE}
          </Button>}
          {shipUnlocked && <Button disabled={view === 'ship'} onClick={() => update({view: 'ship'})}>
              Back to ship
          </Button>}
          {mission && <div>
              Mission: {mission}
          </div>}
        </div>
      </Crt>
  );
};