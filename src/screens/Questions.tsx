import React, { useState } from "react";
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

interface QuestionsProps extends ViewProps {}

const Questions = (props: QuestionsProps) => {
  const [questions, setQuestions] = useState([
    {
      title: "A qual gênero sexual você se considera fazer parte?",
      answerOptions: [
        {
          id: "123594",
          title: "Masculino",
        },
        {
          id: "12394",
          title: "Feminino",
        },
        {
          id: "123597",
          title: "Outro",
        },
      ],
    },
  ]);

  return (
    <View {...props}>
      <ScrollView style={styles.content}>
        <MultiAnswersQuestion question={questions[0]} />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Icon name="arrow-left" size={32} />
        </TouchableOpacity>
        <Text style={styles.questionMarker}>1 / 3</Text>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: "#6750A4" }}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 12,
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
