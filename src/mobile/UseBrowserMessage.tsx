import React from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {Crt} from 'components/Crt';
import {Fade} from "components/Fade";
import {green} from "theme";

const useStyles = createUseStyles({
  root: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center"
  },
  content: {},
  screen: {
    borderRadius: 16,
    margin: 16,
    border: "2px solid " + green[6],
    background: "black",
    animation: '1s ease-out 0s 1 expand',
  },
  heading: {
    borderBottom: "1px solid #Af7",
    animation: 'textShadow 1.6s infinite',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  title: {
    margin: 0
  },
  message: {
    padding: 32,
  }
})


export interface Message {
  paragraphs: string [];
  signOff?: string;
  name?: string;
  title?: string;
}

export const UseBrowserMessage = () => {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <div className={classes.content}>
          <Crt>
            <Fade id={'only'} updateChild={() => {
            }}>
              <div className={classes.screen}>
                <div className={classes.heading}>
                  <h1 className={classes.title}> GALACTIC ROYAL MAIL DROP</h1>
                </div>
                <div className={classes.message}>
                  Please view mail drops on your space computer instead of your space mobile device.
                </div>
              </div>
            </Fade>
          </Crt>
        </div>
      </div>
  );
}

