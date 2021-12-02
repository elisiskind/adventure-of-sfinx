import React, {useContext, useEffect, useState} from 'react';
import {StorageContext} from "storage/StorageProvider";
import {Space} from "Space";
import {Route, Routes} from "react-router-dom";
import {Redirector} from "Redirector";
import {Level1} from "level-1/Level1";
import {BrowserView, MobileView} from 'react-device-detect';
import {Controller} from "mobile/Controller";
import {Level0} from "level-0/Level0";
import {createUseStyles} from "react-jss";

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

const Levels = () => {
  const {loading, level} = useContext(StorageContext);

  useEffect(() => {
    console.log('Level: ' + level + ', Loading: ' + loading)
  }, [level, loading])
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

const DeviceView = () => {

  const {level} = useContext(StorageContext);
  return <>
    <BrowserView style={{height: '100%'}}>
      <Levels/>
    </BrowserView>
    <MobileView>
      {level === 0 ? (
          <>
            Mail drops are not intended to be used on your space phone. Please view this on your space computer instead.
          </>
      ) : (<Controller/>)}
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
