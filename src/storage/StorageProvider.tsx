import React, {createContext, FunctionComponent, useEffect, useState,} from "react";
import {db} from "index";

export interface InternalStorage {
  level: number;
}

export interface Storage {
  level: number;
  loggedIn: boolean;
  guestMode: boolean;
  loading: boolean;
  mutations: {
    login: (guest: boolean) => void;
    logout: () => void;
    updateLevel: (level: number) => Promise<void>;
  }
}

type User = 'NONE' | 'USER' | 'GUEST'

export const StorageContext = createContext<Storage>({} as Storage);

const StorageProvider: FunctionComponent = ({children}) => {
  const [loggedInUser, setLoggedInUser] = useState<User>(localStorage.getItem('loggedInUser') as User | undefined ?? 'NONE');
  const [storage, setStorage] = useState<InternalStorage>({level: 0});
  const [loading, setLoading] = useState<boolean>(true);

  const loggedIn = ['GUEST', 'USER'].includes(loggedInUser);
  const guestMode = loggedInUser === 'GUEST';

  const login = (guest: boolean) => {
    localStorage.setItem('loggedInUser', guest ? 'GUEST' : 'USER');
    setLoggedInUser(guest ? "GUEST" : "USER");
  }
  const logout = () => setLoggedInUser('NONE');

  const updateLevel = async (level: number): Promise<void> => {
    if (storage.level !== level) {
      try {
        await db
        .collection("users")
        .doc("1")
        .update("level", level)
      } catch (err) {
        console.log("Error updating user: " + err);
      }
    }
  };

  const mutations = {
    login,
    logout,
    updateLevel
  }

  useEffect(() => {
    console.log('reading fireabse')
    return db
    .collection("users")
    .doc("1")
    .onSnapshot(
        (data) => {
          setStorage({level: 0, ...(data.data() ?? {})});
          setLoading(false);
        },
        (err) => {
          console.log("Error fetching data: " + err);
        }
    );
  }, []);

  return (
      <StorageContext.Provider
          value={{...storage, loggedIn, guestMode, loading, mutations}}
      >
        {children}
      </StorageContext.Provider>
  );
};

export default StorageProvider;
