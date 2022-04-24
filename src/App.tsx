import React, { useContext, useEffect, useState } from "react";
import { CloudStorageContext } from "storage/CloudStorageProvider";
import { Route, Routes } from "react-router-dom";
import { Redirector } from "components/Redirector";
import * as rdd from "react-device-detect";
import { BrowserView, isBrowser, MobileView } from "react-device-detect";
import { Controller } from "mobile/Controller";
import { createUseStyles } from "react-jss";
import { UseBrowserMessage } from "mobile/UseBrowserMessage";
import { Space } from "game/Space";
import fscreen from "fscreen";
import { LocalStorageContext } from "storage/LocalStorageProvider";
import { GameView } from "game/GameView";
import { AdminPage } from "./admin/AdminPage";
import { NodeTransitionContext } from "./storage/NodeTransitionProvider";

(rdd as any).isMobile = true;

const useStyles = createUseStyles({
  controls: {
    position: "absolute",
    bottom: 10,
    right: 10,
    display: "flex",
    gap: "10px",
  },
  button: {
    border: "none",
    outline: "none",
    cursor: "pointer",
    padding: 10,
    borderRadius: 5,
    background: "rgba(170, 255, 119, 0.1)",
    height: 44,
    "&:hover": {
      background: "rgba(170, 255, 119, 0.2)",
    },
  },
});

const BrowserLevels = () => {
  const { loading } = useContext(CloudStorageContext);
  const { sound } = useContext(LocalStorageContext);

  const [audio] = useState(new Audio("/sound/background-hum.mp3"));

  useEffect(() => {
    if (sound) {
      audio.volume = 0.03;
      audio
        .play()
        .catch((e) => console.error("Failed to play background sound:\n", e));
      audio.loop = true;
    } else {
      audio.pause();
    }
  }, [audio, sound]);

  if (loading) {
    return <></>;
  }

  return <GameView />;
};

const MobileLevels = () => {
  const { loading, shipUnlocked } = useContext(CloudStorageContext);

  if (loading) {
    return <></>;
  } else if (shipUnlocked) {
    return <Controller />;
  } else {
    return <UseBrowserMessage />;
  }
};

const DeviceView = () => {
  return (
    <>
      <BrowserView style={{ height: "100%" }}>
        <BrowserLevels />
      </BrowserView>
      <MobileView style={{ height: "100%" }}>
        <MobileLevels />
      </MobileView>
    </>
  );
};

const App = () => {
  const classes = useStyles();

  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const { loading, requireUnlocked, mailDrop1LoggedIn, update } =
    useContext(CloudStorageContext);
  const { updateNodeId } = useContext(NodeTransitionContext);
  const {
    flicker,
    unlocked,
    sound,
    mutations: { toggleFlicker, toggleSound },
  } = useContext(LocalStorageContext);

  const toggleFullscreen = () => {
    if (fscreen.fullscreenElement) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(document.body);
    }
  };

  useEffect(() => {
    if (fscreen.fullscreenEnabled) {
      fscreen.onfullscreenchange = () => {
        setFullscreen(!!fscreen.fullscreenElement);
      };
    }
  }, []);

  const level1 = async () => {
    if (mailDrop1LoggedIn) {
      await update({
        shipUnlocked: true,
        view: "ship",
      });
    }
  };

  const level2 = async () => {
    await updateNodeId("OPEN_BOX", {
      mailDrop2Unlocked: true,
      view: "mail-drop-2",
    });
  };

  if (loading) {
    return <></>;
  }

  if (!unlocked && requireUnlocked) {
    return <Space />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/9KZ8"
          element={<Redirector to={"/"} mutation={level1} />}
        />
        <Route
          path="/RB47"
          element={<Redirector to={"/"} mutation={level2} />}
        />
        <Route path="/" element={<DeviceView />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Redirector to={"/"} />} />
      </Routes>
      <div className={classes.controls}>
        {fscreen.fullscreenEnabled ? (
          <button className={classes.button} onClick={toggleFullscreen}>
            <img
              src={
                fullscreen
                  ? "/icons/exit-fullscreen.svg"
                  : "/icons/fullscreen.svg"
              }
              alt={"toggle-fullscreen"}
            />
          </button>
        ) : (
          <></>
        )}
        <button className={classes.button} onClick={toggleFlicker}>
          <img
            src={!flicker ? "/icons/flicker-off.svg" : "/icons/flicker-on.svg"}
            alt={"toggle-flicker"}
          />
        </button>
        {isBrowser && (
          <button className={classes.button} onClick={toggleSound}>
            <img
              src={!sound ? "/icons/sound-off.svg" : "/icons/sound-on.svg"}
              alt={"toggle-flicker"}
            />
          </button>
        )}
      </div>
    </>
  );
};

export default App;
