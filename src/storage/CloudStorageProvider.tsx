import React, {
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { db } from "index";
import firebase from "firebase/compat";
import { NodeId } from "game/Nodes";
import { Coordinate } from "../game/Coordinates";

export type Updates = Partial<Omit<CloudStorage, "nodeId">>;
export type NodeUpdates = Partial<CloudStorage>;

export interface CloudStorageInternal {
  mailDrop1LoggedIn: boolean;
  mailDrop2LoggedIn: boolean;
  mailDrop2Unlocked: boolean;
  requireUnlocked: boolean;
  shipUnlocked: boolean;
  warp: boolean;
  nodeId: NodeId;
  coordinates: Coordinate;
  mission: string;
  history: string[];
  view: View;
  airlockTime: number;
}

export type View = "mail-drop-1" | "ship" | "mail-drop-2";

export interface CloudStorage extends CloudStorageInternal {
  loading: boolean;
  update: (updates: Updates) => Promise<void>;
}

export interface NodeIdStorage {
  nodeId: NodeId;
  update: (updates: NodeUpdates) => Promise<void>;
}

export const CloudStorageContext = createContext<CloudStorage>(
  {} as CloudStorage
);
export const NodeIdContext = createContext<NodeIdStorage>({} as NodeIdStorage);

const dataOrDefault = (data: any): CloudStorageInternal => {
  return {
    airlockTime: data.airlockTime ?? 0,
    view: data?.view ?? "mail-drop-1",
    mailDrop1LoggedIn: data?.mailDrop1LoggedIn ?? false,
    shipUnlocked: data?.shipUnlocked ?? false,
    nodeId: data?.nodeId ?? "START_1",
    coordinates: data?.coordinates ?? "3A",
    warp: data?.warp ?? false,
    mailDrop2Unlocked: data?.mailDrop2Unlocked ?? false,
    mailDrop2LoggedIn: data?.mailDrop2LoggedIn ?? false,
    mission: data?.mission,
    requireUnlocked: data?.requireUnlocked ?? true,
    history: data?.history ?? ["3A"],
  };
};

const storageConverter: firebase.firestore.FirestoreDataConverter<CloudStorageInternal> =
  {
    fromFirestore(snapshot): CloudStorageInternal {
      const data = snapshot.data();
      return dataOrDefault(data);
    },
    toFirestore(modelObject) {
      return modelObject;
    },
  };

const CloudStorageProvider: FunctionComponent = ({ children }) => {
  const [storage, setStorage] = useState<CloudStorageInternal>(
    dataOrDefault({})
  );
  const [loading, setLoading] = useState<boolean>(true);

  const update = async (updates: NodeUpdates): Promise<void> => {
    if (updates.nodeId) {
      updates.warp = false;
    }
    if (updates.coordinates && !updates.history) {
      updates.history = [...storage.history, updates.coordinates];
    }

    if (updates === {}) {
      return;
    }

    const updatesAsArray = Object.entries(updates);
    const [key, value] = updatesAsArray.shift()!;

    try {
      await db
        .collection("users")
        .doc("1")
        .update(key, value, ...updatesAsArray.flat());
    } catch (err) {
      console.error(`Error updating: [${key}, ${value}]`, err);
    }
  };

  useEffect(() => {
    try {
      return db
        .collection("users")
        .doc("1")
        .withConverter(storageConverter)
        .onSnapshot(
          (snapshot) => {
            const value = snapshot.data();
            if (value) {
              setStorage(value);
              setLoading(false);
            }
          },
          (err) => {
            setLoading(false);
            console.error("Error fetching data: " + err);
          }
        );
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }, []);

  return (
    <CloudStorageContext.Provider
      value={{ ...storage, loading: loading, update }}
    >
      <NodeIdContext.Provider value={{ nodeId: storage.nodeId, update }}>
        {children}
      </NodeIdContext.Provider>
    </CloudStorageContext.Provider>
  );
};

export default CloudStorageProvider;
