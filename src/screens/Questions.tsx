import { Audio } from "expo-av";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MultiAnswersQuestion from "../components/MultiAnswersQuestion";
import OneAnswerQuestion from "../components/OneAnswerQuestion";
import SubjectiveAnswerQuestion from "../components/SubjectiveAnswerQuestion";
import AuthContext from "../contexts/AuthContext";
import MainContext from "../contexts/MainContext";
import { AnswerEntity } from "../entities/answer.type";
import { QuestionEntity } from "../entities/question.type";
import { saveLocalAnswers } from "../repositories/answers";
import { getQuestions } from "../repositories/questions";

interface QuestionsProps extends ViewProps {
  idQuestionnaire: string;
  onQuestionnaireEnd: () => void;
}

let recordTimeout: undefined | NodeJS.Timeout;

const Questions = (props: QuestionsProps) => {
  const { applier, pin, logOut } = useContext(AuthContext);
  const { updateAnswers, coordinates } = useContext(MainContext);
  const [questions, setQuestions] = useState<QuestionEntity[]>([]);
  const [answers, setAnswers] = useState<{
    [key: string]: AnswerEntity;
  }>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [audioPath, setAudioPath] = useState("");
  const [audioRecord, setAudioRecord] = useState<Audio.Recording>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    fetchQuestions();
    startTimeCount();
    startRecording();
  }, []);

  const startTimeCount = async () => {
    setStartTime(Date.now());
  };

  const startRecording = async () => {
    try {
      console.log("Starting recording!");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      console.log({ recording });
      setAudioRecord(recording);
      console.log({ audioRecord });
      recordTimeout = setTimeout(() => {
        stopRecording(recording);
      }, 5000);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async (
    audioRecording?: Audio.Recording
  ): Promise<string> => {
    console.log({ audioRecording, audioRecord });
    if (!audioRecording) audioRecording = audioRecord;
    if (!audioRecording) return audioPath;
    await audioRecording.stopAndUnloadAsync();
    setAudioPath(audioRecording._uri);
    setAudioRecord(null);
    console.log("Stop recording");
    return audioRecording._uri;
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
    const audioPath = await stopRecording(audioRecord);
    console.log({ recordTimeout });
    if (recordTimeout) clearTimeout(recordTimeout);
    const stopTime = Date.now();
    console.log({ start: startTime, stop: stopTime });
    console.log({
      idQuestionnaire: props.idQuestionnaire,
      audioPath: audioPath,
      lat: coordinates[0],
      lon: coordinates[1],
      duration: stopTime - startTime || 0,
      pin,
      applierId: applier.id,
      createdAt: new Date().toISOString(),
    });
    await saveLocalAnswers(
      {
        idQuestionnaire: props.idQuestionnaire,
        audioPath: audioPath,
        lat: coordinates[0],
        lon: coordinates[1],
        duration: stopTime - startTime || 0,
        pin,
        applierId: applier.id,
        createdAt: new Date().toISOString(),
      },
      Object.values(answers)
    );
    await updateAnswers();
    props.onQuestionnaireEnd();
  };

  const returnCorrectQuestionType = (question: QuestionEntity) => {
    const { id, type } = question;
    if (question && (type === "1" || type === ""))
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
