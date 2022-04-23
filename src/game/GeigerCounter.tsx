import React, { useCallback, useContext, useState } from "react";
import { Beep } from "mobile/Beep";
import { Indicator } from "components/Indicator";
import { NodeTransitionContext } from "storage/NodeTransitionProvider";

export const GeigerCounter = () => {
  const level = useContext(NodeTransitionContext).node.geiger ?? 0;

  const [radiationDetected, setRadiationDetected] = useState<boolean>(false);

  const detectRadiation = useCallback(() => {
    setRadiationDetected(true);
    setTimeout(() => {
      setRadiationDetected(false);
    }, 50);
  }, []);

  const [audio1] = useState(new Audio("/sound/beep.mp3"));
  const [audio2] = useState(new Audio("/sound/beep.mp3"));
  const [audio3] = useState(new Audio("/sound/beep.mp3"));

  return (
    <>
      <Indicator color={"blue"} on={radiationDetected} label={"Radiation"} />
      <Beep
        on={level > 0}
        detect={detectRadiation}
        key="0"
        audio={audio1 as HTMLAudioElement}
      />
      <Beep
        on={level > 1}
        detect={detectRadiation}
        key="1"
        audio={audio2 as HTMLAudioElement}
      />
      <Beep
        on={level > 2}
        detect={detectRadiation}
        key="2"
        audio={audio3 as HTMLAudioElement}
      />
    </>
  );
};
