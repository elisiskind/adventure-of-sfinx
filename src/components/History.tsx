import React, {Fragment, useContext} from "react";
import {createUseStyles} from "react-jss";
import {blue, green} from "theme";
import {CloudStorageContext} from "storage/CloudStorageProvider";

const coordinate = {
  padding: 8,
  backgroundColor: green[1],
  width: '50%',
  borderRadius: 4
}

const blink = {
  animation: 'blink 0.3s infinite'
}

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
  coordinate: coordinate,
  nextCoordinate: {
    ...coordinate,
    ...blink,
    backgroundColor: blue[2],
  },
  nextArrow: {
    ...blink
  }
})

export const History = ({warp}: { warp: boolean }) => {

  const classes = useStyles();

  const {history} = useContext(CloudStorageContext);

  return <div className={classes.root}>
    Navigation
    {history.map((coordinates, i) => {
      return <Fragment key={i}>
        <div className={classes.coordinate}>{coordinates}</div>
        {i === history.length - 1 ? <></> : <div>↓</div>}
      </Fragment>
    })}
    {warp ? <>
      <div className={classes.nextArrow}>↓</div>
      <div className={classes.nextCoordinate}>?</div>
    </> : <></>}
  </div>
}