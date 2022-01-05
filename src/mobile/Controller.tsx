import * as React from 'react';
import {useCallback, useContext, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Crt} from "components/Crt";
import {Gauge} from "components/Gauge";
import {Button} from 'components/Button';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {green} from "theme";
import {Beep} from "mobile/Beep";
import {Indicator} from "mobile/Indicator";

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
  contained:  {
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
});


export const Controller = () => {
  const classes = useStyles();
  const {nodeId} = useContext(CloudStorageContext);
  const [radiationDetected, setRadiationDetected] = useState<boolean>(false);

  const giegerBeep0 = ['AFTER_FIRST_WARP', 'FOLLOW_RADIATION_TRAIL', 'KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep1 = ['FOLLOW_RADIATION_TRAIL', 'KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep2 = ['KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);

  const {
    mutations: {updateLevel},
    mission,
    mailDrop2Unlocked,
    shipUnlocked,
    warp
  } = useContext(CloudStorageContext);

  const detectRadiation = useCallback(() => {
    setRadiationDetected(true);
    setTimeout(() => {
      setRadiationDetected(false);
    }, 50)
  }, []);


  const [audio1] = useState(new Audio('/sound/beep.mp3'));
  const [audio2] = useState(new Audio('/sound/beep.mp3'));
  const [audio3] = useState(new Audio('/sound/beep.mp3'));

  return (
      <Crt>
        <div className={classes.root}>
          <div className={classes.column + ' ' + classes.contained}>
            <div className={classes.row}>
              <Gauge on={warp} label={'Port Thruster'}/>
              <Gauge on={warp} label={'Starboard Thruster'}/>
            </div>
            <div className={classes.divider}/>
            <Indicator color={'blue'} on={radiationDetected} label={'Radiation'}/>
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
        <Beep on={giegerBeep0} detect={detectRadiation} key='0' audio={audio1}/>
        <Beep on={giegerBeep1} detect={detectRadiation} key='1' audio={audio2}/>
        <Beep on={giegerBeep2} detect={detectRadiation} key='2' audio={audio3}/>
      </Crt>
  );
};