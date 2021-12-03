import React, {useContext, useState} from 'react';
import {StorageContext} from "storage/StorageProvider";
import {Route, Routes} from "react-router-dom";
import {Redirector} from "Redirector";
import {Level1} from "level-1/Level1";
import {BrowserView, MobileView} from 'react-device-detect';
import * as rdd from 'react-device-detect';
import {Controller} from "mobile/Controller";
import {Level0} from "level-0/Level0";
import {createUseStyles} from "react-jss";
import {UseBrowserMessage} from "mobile/UseBrowserMessage";
import {Space} from "components/Space";

(rdd as any).isMobile = true;

const useStyles = createUseStyles({
  fullScreenIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    // background: 'none',
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
  const {loading, level} = useContext(StorageContext);

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
  const {loading, level} = useContext(StorageContext);

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
  const {mutations: {updateLevel}} = useContext(StorageContext);

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  document.onfullscreenchange = (() => {
    if (document.fullscreenElement !== null) {
      setFullscreen(true);
    } else {
      setFullscreen(false)
    }
  })

  return <>
    <Routes>
      <Route path="/9KZ8" element={<Redirector to={'/'} mutation={async () => await updateLevel(1)}/>}/>
      <Route path="/" element={<DeviceView/>}/>
      <Route path="*" element={<Redirector to={'/'}/>}/>
    </Routes>
    <button className={classes.fullScreenIcon} onClick={toggleFullscreen}>
      <img src={fullscreen ? '/icons/exit-fullscreen.svg' : '/icons/fullscreen.svg'} alt={'fullscreen'}/>
    </button>
  </>
}

export default App;
