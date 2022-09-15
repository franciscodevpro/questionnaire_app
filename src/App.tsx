import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContextProvider } from "./contexts/AuthContext";
import { Login } from "./screens/Login";
import MainScreen from "./screens/MainScreen";

type authType = {
  pin: string;
  applier: { id: string; name: string };
};

export default function App() {
  const [auth, setAuth] = useState<authType>({ pin: null, applier: null });
  return (
    <NavigationContainer>
      <AuthContextProvider
        value={{
          pin: auth.pin,
          applier: auth.applier,
          logOut: () => setAuth({ pin: null, applier: null }),
        }}
      >
        <SafeAreaView style={{ flex: 1, position: "relative" }}>
          {!!auth.pin && !!auth.applier?.id ? (
            <MainScreen
              onLogout={() => setAuth({ pin: null, applier: null })}
            />
          ) : (
            <Login onLogin={(data) => setAuth(data)} />
          )}
        </SafeAreaView>
      </AuthContextProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
