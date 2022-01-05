import * as React from 'react';
import {useEffect, useState} from 'react';

interface BeepProps {
  on: boolean;
}

export const Beep = ({on}: BeepProps) => {
  const [audioLatch, setAudioLatch] = useState<number>(0);
  const [audio] = useState(new Audio('/sound/beep.mp3'));

  const next = () => {
    setTimeout(() => {
      setAudioLatch(Math.random());
    }, 120 + Math.random() * 500)
  }

  useEffect(() => {
    if (on) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      next();
    }
  }, [audio, next, audioLatch, on])

  return <></>
};