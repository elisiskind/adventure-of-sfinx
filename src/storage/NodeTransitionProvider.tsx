import * as React from 'react';
import {createContext, FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {FailureNodes, NodeId} from "game/Nodes";
import {sleep} from "utils";

interface INodeTransitionContext {
  nodeFadeState: boolean;
  nodeId: NodeId;
  updateNodeId: (id: NodeId, callback?: () => void) => void;
}

export const NodeTransitionContext = createContext<INodeTransitionContext>({} as INodeTransitionContext);

export const NodeTransitionProvider: FunctionComponent = ({children}) => {
  const {
    nodeId,
    mailDrop1LoggedIn,
    mailDrop2Unlocked,
    coordinates,
    failed,
    mutations: {
      updateMission,
      updateNodeId: updateNodeIdInStorage,
      updateField,
    }
  } = useContext(CloudStorageContext);

  const [nodeFadeState, setNodeFadeState] = useState<boolean>(true);

  const [airlockHiss] = useState(new Audio('/sound/airlock-hiss.wav'));

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
    console.log('rerendering...')
    // updateMission('Find Chase in 1D');
  }, [mailDrop1LoggedIn, updateMission]);

  useEffect(() => {
    if (nodeId in FailureNodes && !failed) {
      updateField(BooleanField.FAILED, true)
    } else if (!(nodeId in FailureNodes) && failed) {
      updateField(BooleanField.FAILED, false)
    }

    if (!mailDrop2Unlocked && coordinates === '1D' && nodeId === 'FIRST_WARP') {
      updateNodeId("AFTER_FIRST_WARP");
    }

    if (mailDrop2Unlocked && coordinates === '3E' && nodeId === 'START_FIND_DAUGHTER_MISSION') {
      updateNodeId("SUCCESS_2");
    }
  }, [nodeId, updateField, mailDrop2Unlocked, updateNodeId, coordinates, failed])

  useEffect(() => {
    if (nodeId === 'ENTER_SHIP_2') {
      airlockHiss.play();
    }
  }, [airlockHiss, nodeId])

  return <NodeTransitionContext.Provider value={{nodeFadeState, nodeId, updateNodeId}}>
    {children}
  </NodeTransitionContext.Provider>
}