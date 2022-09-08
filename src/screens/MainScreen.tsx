import * as React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import MainMenu from "../components/MainMenu";
import { Questionnaires } from "./Questionnaires";
import Questions from "./Questions";

interface MainScreenProps {
  onLogout: () => void;
  auth: { pin: string; applier: string };
}

const MainScreen = (props: MainScreenProps) => {
  const [isActive, setIsActive] = React.useState(false);
  return (
    <View style={{ flex: 1, position: "relative", flexDirection: "column" }}>
      <View style={styles.container}>
        <Header onPressMenu={() => setIsActive(true)} />
        <Questions style={styles.content} />
      </View>
      <MainMenu
        isActive={isActive}
        onClosePress={() => setIsActive(false)}
        onChangeApplier={() => props.onLogout()}
        applier={props.auth.applier}
      />
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
