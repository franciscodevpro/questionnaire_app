import React, { Component, ReactComponentElement, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MultiAnswersQuestion from "../components/MultiAnswersQuestion";
import OneAnswerQuestion from "../components/OneAnswerQuestion";
import SubjectiveAnswerQuestion from "../components/SubjectiveAnswerQuestion";

type Question = {
  id: string;
  title: string;
  type: string;
  minAnswers: number;
  maxAnswers: number;
  defaultValue: string;
  shuffle: true;
  prioritizeBySelection: true;
  answerOptions: {
    id: string;
    title: string;
    status: true;
  }[];
};

interface QuestionsProps extends ViewProps {
  onQuestionnaireEnd: () => void;
}

const Questions = (props: QuestionsProps) => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "01",
      title: "A qual gênero sexual você se considera fazer parte?",
      type: "1",
      minAnswers: null,
      maxAnswers: null,
      defaultValue: null,
      shuffle: true,
      prioritizeBySelection: true,
      answerOptions: [
        {
          id: "123594",
          title: "Masculino",
          status: true,
        },
        {
          id: "123595",
          title: "Feminino",
          status: true,
        },
        {
          id: "123596",
          title: "Outro",
          status: true,
        },
      ],
    },
    {
      id: "02",
      title:
        "Se as eleições fossem hoje, em qual desses vocÇe votaria para senador?",
      type: "2",
      minAnswers: 1,
      maxAnswers: 3,
      defaultValue: null,
      shuffle: true,
      prioritizeBySelection: true,
      answerOptions: [
        {
          id: "123584",
          title: "João Gilberto",
          status: true,
        },
        {
          id: "123585",
          title: "Pedro Manse",
          status: true,
        },
        {
          id: "123586",
          title: "Tomás de Aquino",
          status: true,
        },
        {
          id: "353584",
          title: "Hugo de Sá",
          status: true,
        },
        {
          id: "353585",
          title: "Pedro Maranão",
          status: true,
        },
        {
          id: "353586",
          title: "Elias de Deus",
          status: true,
        },
      ],
    },
    {
      id: "02",
      title:
        "Queis melhorias você teria como proposta que, na sua opinião, tornariam melhores as vidas dos cidadãos Florianenses?",
      type: "3",
      minAnswers: null,
      maxAnswers: null,
      defaultValue: null,
      shuffle: true,
      prioritizeBySelection: true,
      answerOptions: null,
    },
  ]);
  const [answers, setAnswers] = useState<{
    [key: string]: {
      idQuestion: string;
      idAnswerOption?: string;
      idAnswerOptions?: string[];
      value?: string;
      duration?: number;
      createdAt?: string;
    };
  }>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [canNext, setCanNext] = useState(false);

  const handlePreviousQuestion = () => {
    if (currentQuestion >= 1) setCurrentQuestion(currentQuestion - 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCanNext(false);
    } else props.onQuestionnaireEnd();
  };

  const returnCorrectQuestion = (question: Question) => {
    const { id, type } = question;
    if (type === "1")
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
    if (type === "2")
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
    else
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
        {!!questions &&
          (!!currentQuestion || currentQuestion === 0) &&
          returnCorrectQuestion(questions[currentQuestion])}
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
          {currentQuestion + 1} / {questions.length}
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
