import React, { useContext, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Fade } from "components/Fade";
import { Space } from "game/Space";
import { Stars } from "game/Stars";
import { green } from "theme";
import { CloudStorageContext } from "storage/CloudStorageProvider";
import { History } from "components/History";
import { GeigerCounter } from "game/GeigerCounter";
import { NodeTransitionContext } from "storage/NodeTransitionProvider";

const useStyles = createUseStyles({
  root: {
    marginTop: 32,
    height: "70%",
    transition: "height 0.3s ease-in-out",
    animation: "1s ease-out 0s 1 expand",
    gap: 32,
    padding: "0 60px",
  },
  inner: {
    display: "flex",
    height: "100%",
    gap: 32,
    padding: "0 60px",
    overflow: "hidden",
  },
  hidden: {
    height: "0% !important",
  },
  screen: {
    border: "2px solid " + green[6],
    borderRadius: 16,
    background: "black",
  },
  windshield: {
    flex: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  sidebar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  geigerCounter: {
    padding: 16,
  },
  history: {
    flex: 1,
    padding: 16,
  },
  message: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "20px",
    fontSize: 20,
    gap: 16,
  },
  overlay: {
    position: "absolute",
    height: "80vh",
    zIndex: 1,
    left: "20%",
  },
  shake: {
    animation: "$shake 1s infinite",
  },
  "@keyframes shake": {
    "10%": {
      transform: "translate3d(-1px, 0, 0)",
    },
    "23%": {
      transform: "translate3d(2px, 3px, 0)",
    },
    "29%": {
      transform: "translate3d(-2px, -1px, 0)",
    },
    "34%": {
      transform: "translate3d(0, 2px, 0)",
    },
    "42%": {
      transform: "translate3d(2px, -3px, 0)",
    },
    "49%": {
      transform: "translate3d(-2px, 2px, 0)",
    },
    "58%": {
      transform: "translate3d(4px, -1px, 0)",
    },
    "75%": {
      transform: "translate3d(-3px, 5px, 0)",
    },
    "87%": {
      transform: "translate3d(6px, -5px, 0)",
    },
    "94%": {
      transform: "translate3d(-2px, 3px, 0)",
    },
  },
});

const SpaceshipView = () => {
  const {
    node: { status },
  } = useContext(NodeTransitionContext);
  const { warp } = useContext(CloudStorageContext);

  const [currentView, setCurrentView] = useState<"stars" | "zoom">("stars");
  const [nextView, setNextView] = useState<"stars" | "zoom">("stars");

  useEffect(() => {
    setNextView(warp || status === "warp-warning" ? "zoom" : "stars");
  }, [warp, status]);

  return (
    <Fade
      id={nextView}
      updateChild={(id: "stars" | "zoom") => {
        setCurrentView(id);
      }}
    >
      {currentView === "stars" ? <Stars /> : <Space />}
    </Fade>
  );
};

export const Spaceship = () => {
  const classes = useStyles();
  const {
    node: { status, showSpaceship: show },
  } = useContext(NodeTransitionContext);

  return (
    <div className={`${classes.root} ${show ? "" : classes.hidden}`}>
      <div
        className={`${classes.inner} ${
          status === "warp-warning" ? classes.shake : ""
        }`}
      >
        <div className={`${classes.sidebar}`}>
          <div className={`${classes.history} ${classes.screen}`}>
            <History />
          </div>
          <div className={`${classes.geigerCounter} ${classes.screen}`}>
            <GeigerCounter />
          </div>
        </div>
        <div className={`${classes.windshield} ${classes.screen}`}>
          {status === "warp-critical" && (
            <img
              className={classes.overlay}
              src={"/img/shatter.svg"}
              alt={"shattered glass"}
            />
          )}
          <SpaceshipView />
        </div>
      </div>
    </div>
  );
};
