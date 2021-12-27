import * as React from 'react';
import {createContext, FunctionComponent, useCallback, useContext, useEffect, useState} from 'react';
import {BooleanField, CloudStorageContext} from "storage/CloudStorageProvider";
import {FailureNodes, NodeId} from "game/Nodes";
import {sleep} from "utils";

interface INodeTransitionContext {
  nodeFadeState: boolean;
  nodeId: NodeId;
  updateNodeId: (id: NodeId) => void;
}

export const NodeTransitionContext = createContext<INodeTransitionContext>({} as INodeTransitionContext);

export const NodeTransitionProvider: FunctionComponent = ({children}) => {
  const {
    nodeId,
    mailDrop1LoggedIn,
    mailDrop2Unlocked,
    coordinates,
    mutations: {
      updateMission,
      updateNodeId: updateNodeIdInStorage,
      updateField,
    }
  } = useContext(CloudStorageContext);

  const [nodeFadeState, setNodeFadeState] = useState<boolean>(true);

  const updateNodeId = useCallback((id: NodeId) => {
    if (nodeId !== id) {
      setNodeFadeState(true);
      sleep(300)
      .then(() => updateNodeIdInStorage(id))
      .then(() => setNodeFadeState(false));

    }
  }, [updateNodeIdInStorage, nodeId])

  useEffect(() => {
    setTimeout(() => {
      setNodeFadeState(false);
    }, 300)
  }, []);

  useEffect(() => {
    console.log('rerendering...')
    updateMission('Find Chase in 1D');
  }, [mailDrop1LoggedIn, updateMission]);

  useEffect(() => {
    if (nodeId in FailureNodes) {
      updateField(BooleanField.FAILED, true)
    } else {
      updateField(BooleanField.FAILED, false)
    }

    if (!mailDrop2Unlocked && coordinates === '1D' && nodeId === 'FIRST_WARP') {
      updateNodeId("AFTER_FIRST_WARP");
    }

    if (mailDrop2Unlocked && coordinates === '3E' && nodeId === 'START_FIND_DAUGHTER_MISSION') {
      updateNodeId("SUCCESS_2");
    }
  }, [nodeId, updateField, mailDrop2Unlocked, updateNodeId, coordinates])

  return <NodeTransitionContext.Provider value={{nodeFadeState, nodeId, updateNodeId}}>
    {children}
  </NodeTransitionContext.Provider>
}