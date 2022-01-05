import React, {createContext, FunctionComponent, useEffect, useState,} from "react";
import {db} from "index";
import firebase from "firebase/compat";
import {NodeId} from "game/Nodes";

interface InternalCloudStorage {
  level: number;
  mailDrop1LoggedIn: boolean;
  shipUnlocked: boolean;
  nodeId: NodeId;
  coordinates: string;
  warp: boolean;
  failed: boolean;
  mailDrop2Unlocked: boolean;
  mailDrop2LoggedIn: boolean;
  requireUnlocked: boolean;
  mission?: string;
}

export enum BooleanField {
  MAIL_DROP_1_LOGGED_IN = 'mailDrop1LoggedIn',
  MAIL_DROP_2_LOGGED_IN = 'mailDrop2LoggedIn',
  MAIL_DROP_2_UNLOCKED = 'mailDrop2Unlocked',
  REQUIRE_UNLOCKED = 'requireUnlocked',
  SHIP_UNLOCKED = 'shipUnlocked',
  FAILED = 'failed',
  WARP = 'warp'
}

export enum StringField {
  NODE_ID = 'nodeId',
  COORDINATES = 'coordinates',
  MISSION = 'mission'
}

export enum NumericField {
  LEVEL = 'level'
}

export type StorageField = NumericField | BooleanField | StringField;

interface CloudMutations {
  updateField: (key: BooleanField, value: boolean) => Promise<void>;
  updateLevel: (level: number) => Promise<void>;
  updateMission: (mission: string) => Promise<void>;
  updateNodeId: (nodeId: NodeId) => Promise<void>;
  updateCoordinates: (coordinates: string) => Promise<void>;
}

export interface CloudStorage extends InternalCloudStorage {
  loading: boolean;
  mutations: CloudMutations;
}

export const CloudStorageContext = createContext<CloudStorage>({} as CloudStorage);

const dataOrDefault = (data: any): InternalCloudStorage => {
  return {
    level: data?.level ?? 0,
    mailDrop1LoggedIn: data?.mailDrop1LoggedIn ?? false,
    shipUnlocked: data?.shipUnlocked ?? false,
    nodeId: data?.nodeId ?? 'START_1',
    coordinates: data?.coordinates ?? '3A',
    failed: data?.failed ?? false,
    warp: data?.warp ?? false,
    mailDrop2Unlocked: data?.mailDrop2Unlocked ?? false,
    mailDrop2LoggedIn: data?.mailDrop2LoggedIn ?? false,
    mission: data?.mission,
    requireUnlocked: data?.requireUnlocked ?? true
  }
}

const storageConverter: firebase.firestore.FirestoreDataConverter<InternalCloudStorage> = {
  fromFirestore(snapshot): InternalCloudStorage {
    const data = snapshot.data()
    return dataOrDefault(data);
  },
  toFirestore(modelObject) {
    return modelObject;
  }
}

const CloudStorageProvider: FunctionComponent = ({children}) => {
  const [storage, setStorage] = useState<InternalCloudStorage>(dataOrDefault({}));
  const [loading, setLoading] = useState<boolean>(true);

  console.log(Object.entries(StringField))

  const updateItem = async <T extends number | boolean | string>(key: StorageField, value: T): Promise<void> => {
    const additional = (key === StringField.NODE_ID) ? [BooleanField.WARP, false] : undefined;

    console.log('Updating: [' + key + ', ' + value + ']' + (additional ? (', [' + additional[0] + ', ' + additional[1] + ']') : ''));

    if (storage[key] !== value) {
      try {
        await db
        .collection("users")
        .doc("1")
        .update(key, value, ...(additional ?? []))
      } catch (err) {
        console.error(`Error updating: [${key}, ${value}]`, err);
      }
    }
  };

  const mutations: CloudMutations = {
    updateField: (key: BooleanField, value: boolean) => updateItem(key, value),
    updateLevel: (level: number) => updateItem(NumericField.LEVEL, level),
    updateNodeId: (nodeId: NodeId) => updateItem(StringField.NODE_ID, nodeId),
    updateMission: (mission: string) => updateItem(StringField.MISSION, mission),
    updateCoordinates: (coordinates => updateItem(StringField.COORDINATES, coordinates))
  }

  useEffect(() => {
    try {
      console.log('Creating firebase snapshot')
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
            setLoading(false)
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
          value={{...storage, loading: loading, mutations}}
      >
        {children}
      </CloudStorageContext.Provider>
  );
};

export default CloudStorageProvider;
