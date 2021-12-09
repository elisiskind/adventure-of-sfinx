import * as React from 'react';
import {createUseStyles} from "react-jss";
import {green, orange, red} from "theme";

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    alignContent: 'stretch'
  },
  gaugeRoot: {
    width: '120px',
    height: '60px',
    margin: 'auto'
  },
  container: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    overflow: 'hidden',
    width: '120px',
    height: '60px',

  },
  background: {
    zIndex: 0,
    position: 'absolute',
    backgroundColor: ({value}: { value: number }) => (value > 70) ? value > 90 ? red[6] : orange[6] : green[6],
    top: 0,
    borderRadius: '150px 150px 0 0',
    width: '120px',
    height: '60px',
    transition: 'background-color 0.5s ease-in-out'
  },
  center: {
    width: '72px',
    height: '36px',
    top: '24px',
    marginLeft: '24px',
    zIndex: 3,
    position: 'absolute',
    backgroundColor: '#000',
    marginRight: 'auto',
    borderRadius: '150px 150px 0 0'
  },
  indicator: {
    width: '120px',
    height: '60px',
    transform: ({value}: { value: number }) => `rotate(${value / 200}turn)`,
    zIndex: 1,
    position: 'absolute',
    backgroundColor: '#223318',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '150px 150px 0 0',
    transformOrigin: 'center bottom',
    transition: 'transform 0.5s ease-in-out'
  },
  label: {
    flexGrow: 1
  }
});

export interface GaugeProps {
  value: number;
  label?: string;
};

export const Gauge = ({value, label}: GaugeProps) => {
  const classes = useStyles({value});

  return (
      <div className={classes.root}>
        <div className={classes.gaugeRoot}>
          <div className={classes.container}>
            <div className={classes.background}/>
            <div className={classes.center}/>
            <div className={classes.indicator}/>
          </div>
        </div>
        <div className={classes.label}>
          {label}
        </div>
      </div>
  );
};