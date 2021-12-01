import React from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {Crt} from "components/Crt";

const useStyles = createUseStyles({

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
  hide: {
    opacity: 0
  },
  hideable: {
    '-webkit-transition': 'opacity 0.3s ease-in-out',
    '-moz-transition': 'opacity 0.3s ease-in-out',
    '-ms-transition': 'opacity 0.3s ease-in-out',
    '-o-transition': 'opacity 0.3s ease-in-out',
  }
})

export const Level1 = () => {
  const classes = useStyles();

  return (
      <Crt>
        <div className={classes.screen}>
          LEVEL 1!!!
        </div>
      </Crt>
  );
}

