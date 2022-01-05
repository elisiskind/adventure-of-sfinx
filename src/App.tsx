import React, {useContext, useEffect, useState} from 'react';
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {Route, Routes} from "react-router-dom";
import {Redirector} from "components/Redirector";
import * as rdd from 'react-device-detect';
import {BrowserView, MobileView} from 'react-device-detect';
import {Controller} from "mobile/Controller";
import {createUseStyles} from "react-jss";
import {UseBrowserMessage} from "mobile/UseBrowserMessage";
import {Space} from "game/Space";
import fscreen from 'fscreen';
import {LocalStorageContext} from "storage/LocalStorageProvider";
import {MailDrop1} from "mail-drop-1/MailDrop1";
import {GameView} from "game/GameView";
import {MailDrop2} from "mail-drop-2/MailDrop2";

(rdd as any).isMobile = true;

const useStyles = createUseStyles({
  controls: {
    position: "absolute",
    bottom: 10,
    right: 10,
    display: 'flex',
    gap: '10px',
  },
  button: {
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: 10,
    borderRadius: 5,
    background: 'rgba(170, 255, 119, 0.1)',
    height: 44,
    '&:hover': {
      background: 'rgba(170, 255, 119, 0.2)'
    }
  },
})

const BrowserLevels = () => {
  const {loading, level} = useContext(CloudStorageContext);

  const [audio] = useState(new Audio('/sound/background-hum.mp3'));

  useEffect(() => {
    audio.play();
    audio.loop = true;
  }, [audio])

  if (loading) {
    return <></>
  }

  switch (level) {
    case 0:
      return <MailDrop1/>;
    case 1:
      return <GameView/>;
    case 2:
      return <MailDrop2/>;
    default:
      return <Space/>
  }
}

const MobileLevels = () => {
  const {loading, shipUnlocked} = useContext(CloudStorageContext);

  if (loading) {
    return <></>
  } else if (shipUnlocked) {
    return <Controller/>;
  } else {
    return <UseBrowserMessage/>;
  }
}

const DeviceView = () => {
  return <>
    <BrowserView style={{height: '100%'}}>
      <BrowserLevels/>
    </BrowserView>
    <MobileView style={{height: '100%'}}>
      <MobileLevels/>
    </MobileView>
  </>
}

const App = () => {
  const classes = useStyles();

  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const {
    loading,
    requireUnlocked,
    mutations: {
      updateLevel,
      updateField
    }
  } = useContext(CloudStorageContext);
  const {
    flicker,
    unlocked,
    mutations: {
      toggleFlicker
    }
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
    await Promise.all([
      await updateField(BooleanField.SHIP_UNLOCKED, true),
      await updateLevel(1)
    ]);
  }

  const level2 = async () => {
    await Promise.all([
      await updateField(BooleanField.MAIL_DROP_2_UNLOCKED, true),
      await updateLevel(2)
    ]);
  }


  if (loading) {
    return <></>
  }

  if (!unlocked && requireUnlocked) {
    return <Space/>
  }

  return <>
    <Routes>
      <Route path="/9KZ8" element={<Redirector to={'/'} mutation={level1}/>}/>
      <Route path="/RB47" element={<Redirector to={'/'} mutation={level2}/>}/>
      <Route path="/" element={<DeviceView/>}/>
      <Route path="*" element={<Redirector to={'/'}/>}/>
    </Routes>
    <div className={classes.controls}>
      {(fscreen.fullscreenEnabled) ?
          <button className={classes.button} onClick={toggleFullscreen}>
            <img src={fullscreen ? '/icons/exit-fullscreen.svg' : '/icons/fullscreen.svg'} alt={'toggle-fullscreen'}/>
          </button> : <></>}
      <button className={classes.button} onClick={toggleFlicker}>
        <img src={flicker ? '/icons/flicker-off.svg' : '/icons/flicker-on.svg'} alt={'toggle-flicker'}/>
      </button>
    </div>
  </>
}

export default App;
