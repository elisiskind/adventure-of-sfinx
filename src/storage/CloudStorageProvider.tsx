import React, {createContext, FunctionComponent, useEffect, useState,} from "react";
import {db} from "index";
import firebase from "firebase/compat";

interface InternalCloudStorage {
  level: number;
  mailDrop1Unlocked: boolean;
  mailDrop1LoggedIn: boolean;
  shipUnlocked: boolean;
}

export enum UnlockableField {
  MAIL_DROP_1_UNLOCKED = 'mailDrop1Unlocked',
  SHIP_UNLOCKED = 'shipUnlocked',
}

export enum BooleanField {
  MAIL_DROP_1_LOGGED_IN = 'mailDrop1LoggedIn',
}

export enum NumericField {
  LEVEL = 'level'
}

export type StorageField = UnlockableField | NumericField | BooleanField;

interface CloudMutations {
  unlockItem: (key: UnlockableField) => void;
  setField: (key: BooleanField, value: boolean) => void;
  updateLevel: (level: number) => Promise<void>;
}

export interface CloudStorage extends InternalCloudStorage {
  loading: boolean;
  mutations: CloudMutations;
}

export const CloudStorageContext = createContext<CloudStorage>({} as CloudStorage);

const dataOrDefault = (data: any): InternalCloudStorage => {
  return {
    level: data?.level ?? 0,
    mailDrop1Unlocked: data?.mailDrop1Unlocked ?? false,
    mailDrop1LoggedIn: data?.mailDrop1LoggedIn ?? false,
    shipUnlocked: data?.shipUnlocked ?? false,
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

  const updateItem = async <T extends number | boolean>(key: StorageField, value: T): Promise<void> => {
    if (storage[key] !== value) {
      try {
        await db
        .collection("users")
        .doc("1")
        .update(key, value)
      } catch (err) {
        console.error(`Error updating: [${key}, ${value}]`, err);
      }
    }
  };

  const mutations: CloudMutations = {
    setField: (key: BooleanField, value: boolean) => updateItem(key, value),
    unlockItem: (key: UnlockableField) => updateItem(key, true),
    updateLevel: (level: number) => updateItem(NumericField.LEVEL, level)
  }

  useEffect(() => {
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
          console.log("Error fetching data: " + err);
        }
    );
  }, []);

  return (
      <CloudStorageContext.Provider
          value={{...storage, loading, mutations}}
      >
        {children}
      </CloudStorageContext.Provider>
  );
};

export default CloudStorageProvider;
