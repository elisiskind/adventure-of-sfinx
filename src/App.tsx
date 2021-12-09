import React, {useContext, useEffect, useState} from 'react';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {Route, Routes} from "react-router-dom";
import {Redirector} from "components/Redirector";
import {Level1} from "level-1/Level1";
import * as rdd from 'react-device-detect';
import {BrowserView, MobileView} from 'react-device-detect';
import {Controller} from "mobile/Controller";
import {Level0} from "level-0/Level0";
import {createUseStyles} from "react-jss";
import {UseBrowserMessage} from "mobile/UseBrowserMessage";
import {Space} from "components/Space";
import fscreen from 'fscreen';
import {LocalStorageContext} from "storage/LocalStorageProvider";

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

  if (loading) {
    return <></>
  }

  switch (level) {
    case 0:
      return <Level0/>;
    case 1:
      return <Level1/>;
    default:
      return <Space/>
  }
}

const MobileLevels = () => {
  const {loading, level} = useContext(CloudStorageContext);

  if (loading) {
    return <></>
  }

  switch (level) {
    case 0:
      return <UseBrowserMessage/>;
    case 1:
      return <Controller/>;
    default:
      return <Space/>
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
  const {mutations: {updateLevel}} = useContext(CloudStorageContext);
  const {mutations: {toggleFlicker}, flicker} = useContext(LocalStorageContext);

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

  return <>
    <Routes>
      <Route path="/9KZ8" element={<Redirector to={'/'} mutation={async () => await updateLevel(1)}/>}/>
      <Route path="/" element={<DeviceView/>}/>
      <Route path="*" element={<Redirector to={'/'}/>}/>
    </Routes>
    <div className={classes.controls}>
      {(fscreen.fullscreenEnabled) ?
          <button className={classes.button} onClick={toggleFullscreen}>
            <img src={fullscreen ? '/icons/exit-fullscreen.svg' : '/icons/fullscreen.svg'} alt={'toggle-fullscreen'}/>
          </button> : <></>}
      <button className={classes.button} onClick={toggleFlicker}>
        <img src={flicker ? '/icons/flicker-off.svg' : '/icons/flicker-on   .svg'} alt={'toggle-flicker'}/>
      </button>
    </div>
  </>
}

export default App;
