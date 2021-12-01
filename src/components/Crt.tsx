import React, {FunctionComponent} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";

const useStyles = createUseStyles({
  root: {
    height: "100%",
    width: "100%",
    paddingTop: '5%',
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
  },
  screen: {
    borderRadius: 15,
    width: '60%',
    height: '70%',
    margin: '0 auto',
    border: "2px solid #Af7",
    background: "black",
    animation: '1s ease-out 0s 1 expand',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20
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
      animation: 'flicker 0.15s infinite',
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
    animation: 'textShadow 1.6s infinite',
    height: '100%',
    width: '100%',
  },
})

export const Crt: FunctionComponent = ({children}) => {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <div className={classes.crt}>
          {children}
        </div>
      </div>
  );
}

