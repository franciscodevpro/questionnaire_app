import * as Location from "expo-location";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import Header from "../components/Header";
import MainMenu from "../components/MainMenu";
import QuestionnansEndAlert from "../components/QuestionnansEndAlert";
import AuthContext from "../contexts/AuthContext";
import { MainContextProvider } from "../contexts/MainContext";
import { QuestionnaireEntity } from "../entities/questionnaire.type";
import { getLocalAnswers } from "../repositories/answers";
import { getQuestionnaires } from "../repositories/questionnaires";
import { synchronizeData } from "../repositories/syncData";
import { Questionnaires } from "./Questionnaires";
import Questions from "./Questions";

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
  const [coordinates, setCoordinates] = useState<[string, string]>(["", ""]);

  useEffect(() => {
    fetchQuestionnaires();
    updateAnswers();
  }, []);
  useEffect(() => {
    getCurrentPosition();
  }, [coordinates]);

  const updateAnswers = async (): Promise<void> => {
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

  const getLocation = async () => {
    try {
      const position = await Location.getCurrentPositionAsync({ accuracy: 3 });
      Alert.alert("Dados", JSON.stringify(position, null, 1));
      console.log(position);
      const newCoordinates: [string, string] = [
        JSON.stringify(position.coords.latitude),
        JSON.stringify(position.coords.longitude),
      ];
      if (
        newCoordinates[0] !== coordinates[0] ||
        newCoordinates[1] !== coordinates[1]
      )
        setCoordinates(newCoordinates);
    } catch (err) {
      Alert.alert(JSON.stringify({ err }, null, 1));
    }
  };
  const getCurrentPosition = async (): Promise<void> => {
    if (Platform.OS === "ios") {
      await getLocation();
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      Alert.alert(JSON.stringify(status, null, 1));
      if (status === "granted") {
        await getLocation();
      } else {
        alert("Permissão de localização negada");
      }
    }
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
        coordinates,
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
