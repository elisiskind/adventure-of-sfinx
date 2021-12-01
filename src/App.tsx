import React, {useContext, useEffect} from 'react';
import {MailDrop} from "level-0/MailDrop";
import {StorageContext} from "storage/StorageProvider";
import {Space} from "Space";
import {Route, Routes} from "react-router-dom";
import {Redirector} from "Redirector";
import {Level1} from "level-1/Level1";
import {BrowserView, MobileView} from 'react-device-detect';
import {Controller} from "mobile/Controller";


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
      return <MailDrop/>;
    case 1:
      return <Level1/>;
    default:
      return <Space/>
  }
}

const DeviceView = () => {
  return <>
    <BrowserView style={{height: '100%'}}>
      <Levels/>
    </BrowserView>
    <MobileView>
      <Controller/>
    </MobileView>
  </>
}

const App = () => {
  const {mutations: {updateLevel}} = useContext(StorageContext);
  return <Routes>
    <Route path="/9KZ8" element={<Redirector to={'/'} mutation={async () => await updateLevel(1)}/>}/>
    <Route path="/" element={<DeviceView/>}/>
    <Route path="*" element={<Redirector to={'/'}/>}/>
  </Routes>
}

export default App;
