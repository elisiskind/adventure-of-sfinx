import * as React from 'react';
import {useEffect, useState} from 'react';

interface BeepProps {
  on: boolean;
  detect: () => void;
  audio: HTMLAudioElement;
}

export const Beep = ({on, detect, audio}: BeepProps) => {
  const [audioLatch, setAudioLatch] = useState<number>(0);

  useEffect(() => {
    const next = () => {
      setTimeout(() => {
        setAudioLatch(Math.random());
      }, 120 + Math.random() * 1000)
    }

    if (on) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
      next();
      detect();
    }
  }, [audio, audioLatch, on, detect])

  return <></>
};