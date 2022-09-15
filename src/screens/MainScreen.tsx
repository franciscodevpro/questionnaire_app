import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import MainMenu from "../components/MainMenu";
import QuestionnansEndAlert from "../components/QuestionnansEndAlert";
import { Questionnaires } from "./Questionnaires";
import Questions from "./Questions";
import AuthContext from "../contexts/AuthContext";
import { synchronizeData } from "../repositories/syncData";
import { MainContextProvider } from "../contexts/MainContext";
import { QuestionnaireEntity } from "../entities/questionnaire.type";
import { getQuestionnaires } from "../repositories/questionnaires";
import { getLocalAnswers } from "../repositories/answers";

interface MainScreenProps {
  onLogout: () => void;
}

const MainScreen = (props: MainScreenProps) => {
  const { applier, pin, logOut } = useContext(AuthContext);
  const [idQuestionnaire, setIdQuestionnaire] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    "Questionnaires" | "Questions"
  >("Questionnaires");
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireEntity[]>(
    []
  );
  const [questionnaireUnsaved, setquestionnaireUnsaved] = useState<{
    [key: string]: number;
  }>({});
  const [allUnsaved, setAllUnsaved] = useState<number>(0);

  useEffect(() => {
    fetchQuestionnaires();
    updateAnswers();
  }, []);

  const updateAnswers = async (): Promise<void> => {
    console.log("Entrou aqui");
    const answers = await getLocalAnswers(applier.id);
    let unsyncData = {};
    answers.forEach((elm) => {
      if (unsyncData[elm?.questionnaireData?.idQuestionnaire])
        unsyncData[elm?.questionnaireData?.idQuestionnaire]++;
      else unsyncData[elm?.questionnaireData?.idQuestionnaire] = 1;
    });
    setAllUnsaved(answers.length);
    setquestionnaireUnsaved(unsyncData);
  };

  const fetchQuestionnaires = async () => {
    const resultData = await getQuestionnaires({
      applierId: applier.id,
      pin,
      unauthorizad: () => {
        logOut();
      },
    });
    setQuestionnaires(resultData);
  };

  const handleAnswerQuestionnaire = (id: string) => {
    setIdQuestionnaire(id);
    setCurrentPage("Questions");
  };
  return (
    <MainContextProvider
      value={{
        questionnaires,
        allUnsaved,
        questionnaireUnsaved,
        syncData: async () => {
          await synchronizeData(applier.id);
          await updateAnswers();
        },
        updateAnswers: async () => await updateAnswers(),
      }}
    >
      <View style={{ flex: 1, position: "relative", flexDirection: "column" }}>
        <View style={styles.container}>
          <Header onPressMenu={() => setIsActive(true)} />
          {currentPage === "Questionnaires" ? (
            <Questionnaires
              style={styles.content}
              answerQuestionnaire={handleAnswerQuestionnaire}
            />
          ) : (
            <Questions
              idQuestionnaire={idQuestionnaire}
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
          applier={applier?.name || "-"}
        />
        <QuestionnansEndAlert
          isActive={isAlertActive}
          onOk={() => {
            setCurrentPage("Questionnaires");
            setIsAlertActive(false);
          }}
        />
      </View>
    </MainContextProvider>
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
