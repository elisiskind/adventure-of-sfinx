import React, {
  createContext,
  FunctionComponent,
  useEffect,
  useState,
} from "react";

export interface LocalStorage {
  admin: boolean;
  flicker: boolean;
  unlocked: boolean;
  sound: boolean;
  mutations: {
    toggleFlicker: () => void;
    toggleSound: () => void;
  };
}

export const LocalStorageContext = createContext<LocalStorage>(
  {} as LocalStorage
);

const getters = {
  flicker: () => !!localStorage.getItem("flicker"),
  unlocked: () => !!localStorage.getItem("unlocked"),
  sound: () => !!localStorage.getItem("sound"),
  admin: () => !!localStorage.getItem("admin"),
};

export const LocalStorageProvider: FunctionComponent = ({ children }) => {
  const [flicker, setFlicker] = useState<boolean>(getters.flicker());
  const [sound, setSound] = useState<boolean>(getters.sound());

  const toggleFlicker = () => {
    if (flicker) {
      localStorage.removeItem("flicker");
      setFlicker(false);
    } else {
      localStorage.setItem("flicker", "true");
      setFlicker(true);
    }
  };

  const toggleSound = () => {
    if (sound) {
      localStorage.removeItem("sound");
      setSound(false);
    } else {
      localStorage.setItem("sound", "true");
      setSound(true);
    }
  };

  const mutations = {
    toggleFlicker,
    toggleSound,
  };

  // capture changes in other windows
  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener("storage", () => {
        setFlicker(getters.flicker());
      });
    }
  }, []);

  return (
    <LocalStorageContext.Provider
      value={{
        unlocked: getters.unlocked(),
        admin: getters.admin(),
        flicker,
        sound,
        mutations,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export default LocalStorageProvider;
