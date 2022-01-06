import React, {createContext, FunctionComponent, useEffect, useState,} from "react";


export interface LocalStorage {
  loggedIn: boolean;
  guestMode: boolean;
  adminMode: boolean;
  flicker: boolean;
  unlocked: boolean;
  sound: boolean;
  mutations: {
    login: (user: User) => void;
    logout: () => void;
    toggleFlicker: () => void;
    toggleSound: () => void;
  }
}

export type User = 'USER' | 'GUEST' | 'ADMIN'

export const LocalStorageContext = createContext<LocalStorage>({} as LocalStorage);

const getters = {
  loggedInUser: () => localStorage.getItem('loggedInUser') as User | undefined,
  flicker: () => !!localStorage.getItem('flicker'),
  unlocked: () => !!localStorage.getItem('unlocked'),
  sound: () => !!localStorage.getItem('sound')
}

export const LocalStorageProvider: FunctionComponent = ({children}) => {
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>(getters.loggedInUser());
  const [flicker, setFlicker] = useState<boolean>(getters.flicker());
  const [sound, setSound] = useState<boolean>(getters.sound());

  const loggedIn = !!loggedInUser
  const guestMode = loggedInUser === 'GUEST';
  const adminMode = loggedInUser === 'ADMIN'

  const login = (user: User) => {
    localStorage.setItem('loggedInUser', user);
    setLoggedInUser(user);
  }
  const logout = () => setLoggedInUser(undefined);

  const toggleFlicker = () => {
    if (flicker) {
      localStorage.removeItem('flicker');
      setFlicker(false);
    } else {
      localStorage.setItem('flicker', 'true');
      setFlicker(true);
    }
  }

  const toggleSound = () => {
    if (sound) {
      localStorage.removeItem('sound');
      setSound(false);
    } else {
      localStorage.setItem('sound', 'true');
      setSound(true);
    }
  }

  const mutations = {
    login,
    logout,
    toggleFlicker,
    toggleSound
  }

  // capture changes in other windows
  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener('storage', () => {
        setLoggedInUser(getters.loggedInUser());
        setFlicker(getters.flicker());
      });
    }
  }, []);

  return (
      <LocalStorageContext.Provider
          value={{loggedIn, unlocked: getters.unlocked(), guestMode, adminMode, flicker, sound, mutations}}
      >
        {children}
      </LocalStorageContext.Provider>
  );
};

export default LocalStorageProvider;
