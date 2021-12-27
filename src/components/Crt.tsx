import React, {FunctionComponent, useContext} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {green, red} from "theme";
import {LocalStorageContext} from "storage/LocalStorageProvider";

interface StyleProps {
  shake: boolean;
  flash: boolean;
  flicker: boolean;
}

const animation = ({shake, flicker, flash}: StyleProps) => {
  let animation = [];
  if (flicker) {
    animation.push('textShadow 1.6s infinite');
  }
  if (flash) {
    animation.push('flash-red 1s infinite');
  }
  if (shake) {
    animation.push('shake 0.5s infinite');
  }

  if (animation.length > 0) {
    return animation.join(', ');
  } else {
    return 'none';
  }
}

const useStyles = createUseStyles({
  red: {
    backgroundColor: red[3],
  },
  root: {
    height: "100%",
    backgroundColor: ({flash}: StyleProps) => flash ? red[3] : 'black',
    display: "flex",
    width: "100%",
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation,
    flexDirection: "column",
    justifyContent: 'center',
    transition: 'background-color 0.3s ease-in-out'
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
      zIndex: 4,
      pointerEvents: 'none',
      animation: ({flicker}: StyleProps) => flicker ? 'flicker 0.15s infinite' : 'none',
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
      zIndex: 4,
      backgroundSize: '100% 2px, 3px 100%',
      pointerEvents: 'none',
    },
    animation: ({flicker}: StyleProps) => flicker ? 'textShadow 1.6s infinite' : 'none',
    height: '90%',
    width: '100%',
  },
})

interface CrtProps {
  flashRed?: boolean;
  shake?: boolean;
}

export const Crt: FunctionComponent<CrtProps> = ({children, flashRed, shake}) => {
  const {flicker} = useContext(LocalStorageContext);
  const classes = useStyles({
    flicker: flicker,
    flash: !!flashRed,
    shake: !!shake
  });

  return (
      <div className={classes.root}>
        <div className={classes.crt}>
          {children}
        </div>
      </div>
  );
}

