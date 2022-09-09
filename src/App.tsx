import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Login } from "./screens/Login";
import MainScreen from "./screens/MainScreen";

type authType = {
  pin: string | null;
  applier: string | null;
};

export default function App() {
  const [auth, setAuth] = useState<authType>({ pin: null, applier: null });
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, position: "relative" }}>
        {!!auth.pin && !!auth.applier ? (
          <MainScreen
            onLogout={() => setAuth({ pin: null, applier: null })}
            auth={auth}
          />
        ) : (
          <Login onLogin={(data) => setAuth(data)} />
        )}
      </SafeAreaView>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
