import React, {useCallback, useContext, useState} from 'react';
import {CloudStorageContext} from "storage/CloudStorageProvider";
import {Beep} from "mobile/Beep";
import {Indicator} from "mobile/Indicator";


export const GeigerCounter = () => {

  const {nodeId} = useContext(CloudStorageContext);

  const [radiationDetected, setRadiationDetected] = useState<boolean>(false);
  const giegerBeep0 = ['AFTER_FIRST_WARP', 'FOLLOW_RADIATION_TRAIL', 'KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep1 = ['FOLLOW_RADIATION_TRAIL', 'KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);
  const giegerBeep2 = ['KEEP_FOLLOWING', "KEEP_FOLLOWING_2"].includes(nodeId);

  const detectRadiation = useCallback(() => {
    setRadiationDetected(true);
    setTimeout(() => {
      setRadiationDetected(false);
    }, 50)
  }, []);


  const [audio1] = useState(new Audio('/sound/beep.mp3'));
  const [audio2] = useState(new Audio('/sound/beep.mp3'));
  const [audio3] = useState(new Audio('/sound/beep.mp3'));

  return (<>

    <Indicator color={'blue'} on={radiationDetected} label={'Radiation'}/>
    <Beep on={giegerBeep0} detect={detectRadiation} key='0' audio={audio1 as HTMLAudioElement}/>
    <Beep on={giegerBeep1} detect={detectRadiation} key='1' audio={audio2 as HTMLAudioElement}/>
    <Beep on={giegerBeep2} detect={detectRadiation} key='2' audio={audio3 as HTMLAudioElement}/>
  </>);
}

