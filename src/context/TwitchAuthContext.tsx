import React, { createContext, useState, useContext } from "react";
import { storage } from "webextension-polyfill";
import { TwitchAuthResponse } from "../types/TwitchAuthResponse";

interface TwitchAuthContextType {
  accessToken: TwitchAuthResponse | null;
  saveAccessToken: (accessToken: TwitchAuthResponse | null) => void;
  removeAccessToken: () => void;
}

const TwitchAuthContext = createContext<TwitchAuthContextType | undefined>(
  undefined
);

export const useTwitchAuth = () => {
  const context = useContext(TwitchAuthContext);

  if (!context) {
    throw new Error("useTwitchAuth must be used within a TwitchAuthProvider");
  }

  return context;
};

export const TwitchAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState<TwitchAuthResponse | null>(
    null
  );

  const saveAccessToken = (accessToken: TwitchAuthResponse | null) => {
    if (accessToken === null) return;
    storage.local.set({ "tw-access-token": accessToken });
    setAccessToken(accessToken);
  };

  const removeAccessToken = () => {
    setAccessToken(null);
    storage.local.remove("tw-access-token");
  };

  return (
    <TwitchAuthContext.Provider
      value={{ accessToken, saveAccessToken, removeAccessToken }}
    >
      {children}
    </TwitchAuthContext.Provider>
  );
};
