import React, { useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { Audio } from "expo-av";
import {
  Text,
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MultiAnswersQuestion from "../components/MultiAnswersQuestion";
import OneAnswerQuestion from "../components/OneAnswerQuestion";
import SubjectiveAnswerQuestion from "../components/SubjectiveAnswerQuestion";
import AuthContext from "../contexts/AuthContext";
import { QuestionEntity } from "../entities/question.type";
import { getQuestions } from "../repositories/questions";
import { AnswerEntity } from "../entities/answer.type";
import { saveLocalAnswers } from "../repositories/answers";
import MainContext from "../contexts/MainContext";

interface QuestionsProps extends ViewProps {
  idQuestionnaire: string;
  onQuestionnaireEnd: () => void;
}

const Questions = (props: QuestionsProps) => {
  const { applier, pin, logOut } = useContext(AuthContext);
  const { updateAnswers } = useContext(MainContext);
  const [questions, setQuestions] = useState<QuestionEntity[]>([]);
  const [answers, setAnswers] = useState<{
    [key: string]: AnswerEntity;
  }>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [coordinates, setCoordinates] = useState<[string, string]>([
    null,
    null,
  ]);
  const [audioPath, setAudioPath] = useState("");

  useEffect(() => {
    fetchQuestions();
    startRecording();
  }, []);
  useEffect(() => {
    getCurrentPosition();
  }, [coordinates]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setTimeout(function () {
        Alert.alert("Parando gravação.");
        stopRecording(recording);
      }, 5000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async (recordingObj: Audio.Recording) => {
    await recordingObj.stopAndUnloadAsync();
    //const { sound } = await recordingObj.createNewLoadedSoundAsync();
    setAudioPath(recordingObj._uri);
  };

  const getLocation = async () => {
    const position = await Location.getCurrentPositionAsync({ accuracy: 3 });
    const newCoordinates: [string, string] = [
      JSON.stringify(position.coords.latitude),
      JSON.stringify(position.coords.longitude),
    ];
    if (
      newCoordinates[0] !== coordinates[0] ||
      newCoordinates[1] !== coordinates[1]
    )
      setCoordinates(newCoordinates);
  };
  const getCurrentPosition = async (): Promise<void> => {
    if (Platform.OS === "ios") {
      await getLocation();
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await getLocation();
      } else {
        alert("Permissão de localização negada");
      }
    }
  };

  const fetchQuestions = async () => {
    const resultData = await getQuestions(
      { idQuestionnaire: props.idQuestionnaire },
      {
        applierId: applier.id,
        pin,
        unauthorizad: () => {
          logOut();
        },
      }
    );
    setQuestions(resultData);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion >= 1) setCurrentQuestion(currentQuestion - 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (questions?.length - 1 || 0)) {
      setCurrentQuestion(currentQuestion + 1);
      setCanNext(false);
    } else finishQuestionnaire();
  };

  const finishQuestionnaire = async () => {
    await saveLocalAnswers(
      {
        idQuestionnaire: props.idQuestionnaire,
        audioPath: audioPath,
        lat: coordinates[0],
        lon: coordinates[1],
        duration: 0,
        pin,
        applierId: applier.id,
      },
      Object.values(answers)
    );
    await updateAnswers();
    props.onQuestionnaireEnd();
  };

  const returnCorrectQuestionType = (question: QuestionEntity) => {
    const { id, type } = question;
    if (question && type === "1")
      return (
        <OneAnswerQuestion
          question={question}
          onAnswer={(answer: string) => {
            setAnswers({
              ...answers,
              [id]: { idQuestion: id, idAnswerOption: answer },
            });
            if (!!answer) return setCanNext(true);
            setCanNext(false);
          }}
        />
      );
    if (question && type === "2")
      return (
        <MultiAnswersQuestion
          question={question}
          onAnswer={(allAnswers: string[]) => {
            setAnswers({
              ...answers,
              [id]: { idQuestion: id, idAnswerOptions: allAnswers },
            });

            if (
              !!allAnswers.length &&
              allAnswers.length >= question.minAnswers &&
              allAnswers.length <= question.maxAnswers
            )
              return setCanNext(true);
            setCanNext(false);
          }}
        />
      );
    else if (question)
      return (
        <SubjectiveAnswerQuestion
          question={question}
          onAnswer={(answer: string) => {
            setAnswers({
              ...answers,
              [id]: { idQuestion: id, value: answer },
            });
            if (!!answer) return setCanNext(true);
            setCanNext(false);
          }}
        />
      );
  };

  return (
    <View {...props}>
      <ScrollView style={styles.content}>
        {!!questions?.length &&
          (!!currentQuestion || currentQuestion === 0) &&
          returnCorrectQuestionType(questions[currentQuestion])}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={{
            ...styles.button,
            opacity: !(currentQuestion < 1) ? 1 : 0.3,
          }}
          onPress={handlePreviousQuestion}
          disabled={currentQuestion < 1}
        >
          <Icon name="arrow-left" size={32} />
        </TouchableOpacity>
        <Text style={styles.questionMarker}>
          {currentQuestion + 1} / {questions?.length || 0}
        </Text>
        <TouchableOpacity
          style={{
            ...styles.button,
            borderWidth: 0,
            backgroundColor: "#6750A4",
            opacity: canNext ? 1 : 0.3,
          }}
          onPress={handleNextQuestion}
          disabled={!canNext}
        >
          <Icon name="arrow-right" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Questions;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  footer: {
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  questionMarker: {
    borderWidth: 1,
    borderRadius: 5,
    width: 144,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
