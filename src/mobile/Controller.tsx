import * as React from 'react';
import {createUseStyles} from "react-jss";
import {Crt} from "components/Crt";

const useStyles = createUseStyles({
  root: {
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
});

export const Controller = () => {
  const classes = useStyles();

  return (
      <Crt>
        <div className={classes.root}>
          Welcome to space!
        </div>
      </Crt>
  );
};