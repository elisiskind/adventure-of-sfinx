import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { LocalStorageContext } from "storage/LocalStorageProvider";

interface BeepProps {
  on: boolean;
  detect: () => void;
  audio: HTMLAudioElement;
}

export const Beep = ({ on, detect, audio }: BeepProps) => {
  const [audioLatch, setAudioLatch] = useState<number>(0);
  const { sound } = useContext(LocalStorageContext);

  useEffect(() => {
    const next = () => {
      setTimeout(() => {
        setAudioLatch(Math.random());
      }, 120 + Math.random() * 1000);
    };

    if (on) {
      if (sound) {
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
        audio
          .play()
          .catch((e) => console.error("Failed to play geiger counter beep", e));
      }
      next();
      detect();
    }
  }, [audio, audioLatch, on, detect, sound]);

  return <></>;
};
