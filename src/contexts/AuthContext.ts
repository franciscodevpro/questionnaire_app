import React, { createContext } from "react";

const AuthContext = createContext<{
  pin?: string;
  applier?: { id: string; name: string };
  logOut?: () => void;
}>(null);

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

export default AuthContext;
