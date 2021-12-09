import React, {FunctionComponent, useContext} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {green} from "theme";
import {LocalStorageContext} from "storage/LocalStorageProvider";

const useStyles = createUseStyles({
  root: {
    height: "100%",
    display: "flex",
    width: "100%",
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation: ({flicker}: {flicker: boolean}) => flicker ? 'textShadow 1.6s infinite' : 'none',
    flexDirection: "column",
    justifyContent: 'center'
  },
  crt: {
    '&::after': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: 'rgba(18, 16, 16, 0.1)',
      opacity: 0,
      zIndex: 2,
      pointerEvents: 'none',
      animation: ({flicker}: {flicker: boolean}) => flicker ? 'flicker 0.15s infinite' : 'none',
    },
    '&::before': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      zIndex: 2,
      backgroundSize: '100% 2px, 3px 100%',
      pointerEvents: 'none',
    },
    animation: ({flicker}: {flicker: boolean}) => flicker ? 'textShadow 1.6s infinite' : 'none',
    height: '90%',
    width: '100%',
  },
})

export const Crt: FunctionComponent = ({children}) => {
  const {flicker} = useContext(LocalStorageContext);
  const classes = useStyles({flicker});

  return (
      <div className={classes.root}>
        <div className={classes.crt}>
          {children}
        </div>
      </div>
  );
}

