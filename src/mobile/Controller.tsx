import * as React from 'react';
import {useContext, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Crt} from "components/Crt";
import {Gauge} from "components/Gauge";
import {Button} from 'components/Button';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {green} from "theme";
import {Beep} from "mobile/Beep";

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
  row: {
    display: 'flex',
    gap: 16,
  },
  column: {
    borderRadius: 16,
    border: "2px solid " + green[6],
    padding: 16,
    flex: 1,
    justifyContent: 'center'
  },
});


export const Controller = () => {
  const classes = useStyles();
  const {nodeId} = useContext(CloudStorageContext);

  const giegerBeep0 = ['FOLLOW_RADIATION_TRAIL', 'KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep1 = ['KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep2 = ["KEEP_FOLLOWING_2"].includes(nodeId);

  const {
    mutations: {updateLevel},
    mission,
    mailDrop2Unlocked,
    shipUnlocked,
    warp
  } = useContext(CloudStorageContext);

  return (
      <Crt>
        <div className={classes.root}>
          <div className={classes.row}>
            <div className={classes.column}>
              <Gauge on={warp} label={'Port Thruster'}/>
            </div>
            <div className={classes.column}>
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
        <Beep on={giegerBeep0}/>
        <Beep on={giegerBeep1}/>
        <Beep on={giegerBeep2}/>
      </Crt>
  );
};