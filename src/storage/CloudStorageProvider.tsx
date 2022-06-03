import React, {createContext, FunctionComponent, useContext, useEffect, useState,} from "react";
import {db} from "index";
import {NodeId} from "game/Nodes";
import {Coordinate} from "../game/Coordinates";
import {doc, FirestoreDataConverter, onSnapshot, setDoc, updateDoc} from "@firebase/firestore";
import {AuthContext} from "../auth/AuthProvider";

export type Updates = Partial<Omit<CloudStorageInternal, "nodeId">>;
export type NodeUpdates = Partial<CloudStorage>;

export interface CloudStorageInternal {
    mailDrop1LoggedIn: boolean;
    mailDrop2LoggedIn: boolean;
    mailDrop2Unlocked: boolean;
    shipUnlocked: boolean;
    warp: boolean;
    nodeId: NodeId;
    coordinates: Coordinate;
    mission: string;
    history: Coordinate[];
    view: View;
    airlockTime: number;
    gunDrawn: boolean;
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
        mission: data?.mission ?? '',
        history: data?.history ?? ["3A"],
        gunDrawn: data?.gunDrawn ?? false,
    };
};

const storageConverter: FirestoreDataConverter<CloudStorageInternal> =
    {
        fromFirestore(snapshot): CloudStorageInternal {
            console.log('Retrieving the data: ', snapshot)
            return dataOrDefault(snapshot.data());
        },
        toFirestore(modelObject) {
            return modelObject;
        },
    };

const CloudStorageProvider: FunctionComponent = ({children}) => {
    const {userId} = useContext(AuthContext);

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
            await updateDoc(doc(db, "users", userId), key, value, ...updatesAsArray.flat());
        } catch (err) {
            console.error(`Error updating: [${key}, ${value}]`, err);
        }
    };

    useEffect(() => {
        try {
            return onSnapshot(doc(db, "users", userId).withConverter(storageConverter),
                (snapshot) => {
                    const value = snapshot.data();
                    if (value) {
                        setStorage(value);
                        setLoading(false);
                    } else {
                        setDoc(doc(db, "users", userId), dataOrDefault({}));
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
    }, [userId]);

    return (
        <CloudStorageContext.Provider
            value={{...storage, loading: loading, update}}
        >
            <NodeIdContext.Provider value={{nodeId: storage.nodeId, update}}>
                {children}
            </NodeIdContext.Provider>
        </CloudStorageContext.Provider>
    );
};

export default CloudStorageProvider;
