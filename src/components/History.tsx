import React, {Fragment, useContext} from "react";
import {createUseStyles} from "react-jss";
import {blue, green} from "theme";
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {NodeTransitionContext} from "../storage/NodeTransitionProvider";

const useStyles = createUseStyles({
  '@keyframes blink': {
    '50%': {
      opacity: 0
    }
  },
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    wdith: '100%'
  },
  coordinate: {
    padding: 8,
    backgroundColor: green[1],
    width: '50%',
    borderRadius: 4
  },
  nextCoordinate: {
    animation: '$blink 0.3s infinite',
    backgroundColor: blue[2],
  },
  nextArrow: {
    animation: '$blink 0.3s infinite'
  }
})

export const History = () => {

  const classes = useStyles();
  const {history, warp} = useContext(CloudStorageContext);
  const {node: {status}} = useContext(NodeTransitionContext);

  return <div className={classes.root}>
    Navigation
    {history.map((coordinates, i) => {
      return <Fragment key={i}>
        <div className={classes.coordinate}>{coordinates}</div>
        {i === history.length - 1 ? <></> : <div>↓</div>}
      </Fragment>
    })}
    {(warp || status === 'warp-warning')? <>
      <div className={classes.nextArrow}>↓</div>
      <div className={`${classes.nextCoordinate} ${classes.coordinate}`}>?</div>
    </> : <></>}
  </div>
}