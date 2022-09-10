import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import MainMenu from "../components/MainMenu";
import QuestionnansEndAlert from "../components/QuestionnansEndAlert";
import { Questionnaires } from "./Questionnaires";
import Questions from "./Questions";

interface MainScreenProps {
  onLogout: () => void;
  auth: { pin: string; applier: string };
}

const MainScreen = (props: MainScreenProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "Questionnaires" | "Questions"
  >("Questionnaires");
  return (
    <View style={{ flex: 1, position: "relative", flexDirection: "column" }}>
      <View style={styles.container}>
        <Header onPressMenu={() => setIsActive(true)} />
        {currentPage === "Questionnaires" ? (
          <Questionnaires
            style={styles.content}
            answerQuestionnaire={(id) => setCurrentPage("Questions")}
          />
        ) : (
          <Questions
            style={styles.content}
            onQuestionnaireEnd={() => setIsAlertActive(true)}
          />
        )}
      </View>
      <MainMenu
        isActive={isActive}
        onClosePress={() => setIsActive(false)}
        onChangeApplier={() => props.onLogout()}
        onListQuestionnaires={() => {
          setCurrentPage("Questionnaires");
          setIsActive(false);
        }}
        applier={props.auth.applier}
      />
      <QuestionnansEndAlert
        isActive={isAlertActive}
        onOk={() => {
          setCurrentPage("Questionnaires");
          setIsAlertActive(false);
        }}
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
