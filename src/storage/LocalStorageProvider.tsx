import React, {createContext, FunctionComponent, useEffect, useState,} from "react";


export interface LocalStorage {
  loggedIn: boolean;
  guestMode: boolean;
  adminMode: boolean;
  flicker: boolean;
  mutations: {
    login: (user: User) => void;
    logout: () => void;
    toggleFlicker: () => void;
  }
}

export type User = 'USER' | 'GUEST' | 'ADMIN'

export const LocalStorageContext = createContext<LocalStorage>({} as LocalStorage);

const getters = {
  loggedInUser: () => localStorage.getItem('loggedInUser') as User | undefined,
  flicker: () => !!localStorage.getItem('flicker')
}

export const LocalStorageProvider: FunctionComponent = ({children}) => {
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>(getters.loggedInUser());
  const [flicker, setFlicker] = useState<boolean>(getters.flicker());

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

  const mutations = {
    login,
    logout,
    toggleFlicker
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
          value={{loggedIn, guestMode, adminMode, flicker, mutations}}
      >
        {children}
      </LocalStorageContext.Provider>
  );
};

export default LocalStorageProvider;
