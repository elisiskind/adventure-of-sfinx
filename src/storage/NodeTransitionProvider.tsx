import * as React from 'react';
import {createContext, FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {BooleanField, CloudStorageContext, NodeIdContext} from "storage/CloudStorageProvider";
import {FailureNodes, gameGraph, NodeId, TextNode} from "game/Nodes";
import {sleep} from "utils";
import {LocalStorageContext} from "storage/LocalStorageProvider";

interface INodeTransitionContext {
  nodeFadeState: boolean;
  node: TextNode;
  updateNodeId: (id: NodeId, callback?: () => void) => void;
}

export const NodeTransitionContext = createContext<INodeTransitionContext>({} as INodeTransitionContext);

export const NodeTransitionProvider: FunctionComponent = ({children}) => {
  const {nodeId} = useContext(NodeIdContext);

  const {
    mailDrop2Unlocked,
    coordinates,
    failed,
    warp,
    mutations: {
      updateNodeId: updateNodeIdInStorage,
      updateField,
    }
  } = useContext(CloudStorageContext);

  const [nodeFadeState, setNodeFadeState] = useState<boolean>(true);
  const {sound} = useContext(LocalStorageContext);

  const [airlockHiss] = useState(new Audio('/sound/airlock-hiss.wav'));
  const [warpSound] = useState(new Audio('/sound/warp.wav'));

  const updateNodeId = useCallback((id: NodeId, callback?: () => void) => {
    if (nodeId !== id) {
      setNodeFadeState(true);
      sleep(300)
      .then(() => updateNodeIdInStorage(id))
      .then(() => setNodeFadeState(false))
      .then(callback);
    }
  }, [updateNodeIdInStorage, nodeId])

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
    if (warp) {
      warpSound.pause();
      warpSound.currentTime = 0;
      warpSound.play();
    }
  }, [warp, warpSound])

  useEffect(() => {
    if (nodeId in FailureNodes && !failed) {
      updateField(BooleanField.FAILED, true)
    } else if (!(nodeId in FailureNodes) && failed) {
      updateField(BooleanField.FAILED, false)
    }

    if (!mailDrop2Unlocked && coordinates === '1D' && nodeId === 'FIRST_WARP') {
      updateNodeId("AFTER_FIRST_WARP");
    }

    // if (mailDrop2Unlocked && coordinates === '3E' && nodeId === 'START_FIND_DAUGHTER_MISSION') {
    //   updateNodeId("SUCCESS_2");
    // }
  }, [nodeId, updateField, mailDrop2Unlocked, updateNodeId, coordinates, failed])

  useEffect(() => {
    if (nodeId === 'DOCK_WITH_SHIP') {
      airlockHiss.play();
    }
  }, [airlockHiss, nodeId])

  const graph = gameGraph();
  return <NodeTransitionContext.Provider value={{nodeFadeState, node: graph[nodeId], updateNodeId}}>
    {children}
  </NodeTransitionContext.Provider>
}