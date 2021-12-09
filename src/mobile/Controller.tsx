import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {createUseStyles} from "react-jss";
import {Crt} from "components/Crt";
import {Gauge} from "components/Gauge";
import {Button} from 'components/Button';
import {CloudStorageContext} from "storage/CloudStorageProvider";

const useStyles = createUseStyles({
  root: {
    height: '100%',
    width: 'calc(100% - 40px)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: '1s ease-out 0s 1 expand',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  column: {
    borderRadius: 15,
    border: "2px solid #Af7",
    padding: 20,
    flex: 1,
    justifyContent: 'center'
  },
});

const random = (max: number) => {
  return Math.floor(Math.random() * max)
}

const scheduleNext = (setter: React.Dispatch<React.SetStateAction<number>>, avoid: number, on: boolean) => {
  if (on) {
    let val = 100 - (random(10) * random(10))
    if (val === avoid) {
      val = val + 1;
    }
    setter(val);
  } else {
    setter(0)
  }
}

export const Controller = () => {
  const classes = useStyles();

  const [val1, setVal1] = useState<number>(0);
  const [val2, setVal2] = useState<number>(0);
  const [enginesOn, setEnginesOn] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => scheduleNext(setVal1, val1, enginesOn), 300 + random(200));
  }, [val1, enginesOn])

  useEffect(() => {
    setTimeout(() => scheduleNext(setVal2, val2, enginesOn), 300 + random(200));
  }, [val2, enginesOn])

  const toggleThrusters = () => {
    setEnginesOn(!enginesOn)
  }

  const {mutations: {updateLevel}} = useContext(CloudStorageContext);

  return (
      <Crt>
        <div className={classes.root}>
          <div className={classes.row}>
            <div className={classes.column}>
              <Gauge value={val1} label={'Port Thruster'}/>
            </div>
            <div className={classes.column}>
              <Gauge value={val2} label={'Starboard Thruster'}/>
            </div>
          </div>
          <Button onClick={toggleThrusters}>
            Toggle Thrusters
          </Button>
          <Button onClick={() => updateLevel(0)}>
            Back to mail drop
          </Button>
        </div>
      </Crt>
  );
};