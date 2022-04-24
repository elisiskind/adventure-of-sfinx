import * as React from "react";
import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CloudStorageContext,
  NodeIdContext,
  Updates,
} from "storage/CloudStorageProvider";
import { gameGraph, NodeId, TextNode } from "game/Nodes";
import { sleep } from "utils";
import { LocalStorageContext } from "storage/LocalStorageProvider";

interface INodeTransitionContext {
  nodeFadeState: boolean;
  node: TextNode;
  nodeId: NodeId;
  updateNodeId: (id: NodeId, updates?: Updates, callback?: () => void) => void;
}

export const NodeTransitionContext = createContext<INodeTransitionContext>(
  {} as INodeTransitionContext
);

const soundFiles = {
  airlockHiss: "airlock-hiss.wav",
  openDoor: "open-door.wav",
  pop: "pop.wav",
  music: "scifi-music.wav",
  hum: "hum.wav",
  ding: "ding.wav",
  endMusic: "end-music.wav",
};

export type Sound = keyof typeof soundFiles;
export type Sounds = { [key in Sound]: HTMLAudioElement };

export const NodeTransitionProvider: FunctionComponent = ({ children }) => {
  const { nodeId, update: updateNodeInStorage } = useContext(NodeIdContext);
  const gameContext = useContext(CloudStorageContext);
  const node = gameGraph(gameContext)[nodeId];

  const [nodeFadeState, setNodeFadeState] = useState<boolean>(true);
  const { sound } = useContext(LocalStorageContext);

  const [warpSound] = useState(new Audio("/sound/warp.wav"));

  const [sounds] = useState<Sounds>(
    Object.entries(soundFiles).reduce<Partial<Sounds>>(
      (prev, [soundName, soundFile]) => {
        return { ...prev, [soundName]: new Audio("/sound/" + soundFile) };
      },
      {}
    ) as Sounds
  );

  const updateNodeId = useCallback(
    (id: NodeId, updates: Updates = {}, callback?: () => void) => {
      const next = gameGraph(gameContext)[id];

      if (nodeId !== id) {
        setNodeFadeState(true);
        sleep(300)
          .then(() => {
            console.log("Updating node to " + id);
            return updateNodeInStorage({
              nodeId: id,
              ...updates,
              ...next.onTransition,
            });
          })
          .then(() => setNodeFadeState(false))
          .then(() => {
            callback?.();
            if (next.sound) {
              const soundElement = sounds[next.sound];
              soundElement.pause();
              soundElement.currentTime = 0;
              soundElement
                .play()
                .catch((e) =>
                  console.error(
                    `Failed to play ${next.sound} sound effect:\n`,
                    e
                  )
                );
            }
          });
      }
    },
    [nodeId, updateNodeInStorage, gameContext, sounds]
  );

  useEffect(() => {
    setTimeout(() => {
      setNodeFadeState(false);
    }, 300);
  }, []);

  useEffect(() => {
    const volume = sound ? 0.5 : 0;
    Object.values(sounds).forEach((sound) => (sound.volume = volume));
    warpSound.volume = 0.5;
  }, [sounds, warpSound, sound]);

  useEffect(() => {
    if (gameContext.warp) {
      warpSound.pause();
      warpSound.currentTime = 0;
      warpSound
        .play()
        .catch((e) => console.error("Failed to play warp sound effect:\n", e));
    }
  }, [gameContext.warp, warpSound]);

  return (
    <NodeTransitionContext.Provider
      value={{ nodeFadeState, node, updateNodeId, nodeId }}
    >
      {children}
    </NodeTransitionContext.Provider>
  );
};
