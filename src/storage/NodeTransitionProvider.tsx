import * as React from 'react';
import {createContext, FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {CloudStorageContext, NodeIdContext, Updates} from "storage/CloudStorageProvider";
import {gameGraph, NodeId, TextNode} from "game/Nodes";
import {sleep} from "utils";
import {LocalStorageContext} from "storage/LocalStorageProvider";

interface INodeTransitionContext {
  nodeFadeState: boolean;
  node: TextNode;
  nodeId: NodeId;
  updateNodeId: (id: NodeId, updates?: Updates, callback?: () => void) => void;
}

export const NodeTransitionContext = createContext<INodeTransitionContext>({} as INodeTransitionContext);

export const NodeTransitionProvider: FunctionComponent = ({children}) => {
  const {nodeId, update: updateNodeInStorage} = useContext(NodeIdContext);

  const gameContext = useContext(CloudStorageContext);


  const [nodeFadeState, setNodeFadeState] = useState<boolean>(true);
  const {sound} = useContext(LocalStorageContext);

  const [airlockHiss] = useState(new Audio('/sound/airlock-hiss.wav'));
  const [warpSound] = useState(new Audio('/sound/warp.wav'));

  const updateNodeId = useCallback((id: NodeId, updates: Updates = {}, callback?: () => void) => {
    const next = gameGraph(gameContext)[id];

    if (id === 'START_1') {
      updates.airlockTime = 0;
    }
    if (next.increaseAirlockTime) {
      updates.airlockTime = gameContext.airlockTime + 1;
    }

    if (nodeId !== id) {
      setNodeFadeState(true);
      sleep(300)
      .then(() => {
        console.log('Updating node to ' + id)
        return updateNodeInStorage({nodeId: id, ...updates})
      })
      .then(() => setNodeFadeState(false))
      .then(() => {
        console.log('Done')
        callback?.()
      });
    }
  }, [nodeId, updateNodeInStorage, gameContext])

  useEffect(() => {
    setTimeout(() => {
      setNodeFadeState(false);
    }, 300)
  }, []);

  useEffect(() => {
    if (sound) {
      airlockHiss.volume = 0.5;
      warpSound.volume = 0.5;
    } else {
      airlockHiss.volume = 0;
      warpSound.volume = 0;
    }
  }, [airlockHiss, warpSound, sound])

  useEffect(() => {
    if (gameContext.warp) {
      warpSound.pause();
      warpSound.currentTime = 0;
      warpSound.play().catch(e => console.error('Failed to play warp sound effect:\n', e));
    }
  }, [gameContext.warp, warpSound])


  useEffect(() => {
    if (nodeId === 'DOCK_WITH_SHIP') {
      airlockHiss.play().catch(e => {
        console.error('Failed to play airlock sound effect:\n', e)
      });
    }
  }, [airlockHiss, nodeId])

  const graph = gameGraph(gameContext);
  return <NodeTransitionContext.Provider value={{nodeFadeState, node: graph[nodeId], updateNodeId, nodeId}}>
    {children}
  </NodeTransitionContext.Provider>
}