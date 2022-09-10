import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface OneAnswerQuestionProps {
  question: {
    title: string;
    answerOptions: {
      id: string;
      title: string;
    }[];
  };
  onAnswer: (answer: string) => void;
}

const OneAnswerQuestion = (props: OneAnswerQuestionProps) => {
  const { question } = props;
  const [checked, setChecked] = useState<string | null>(null);
  const isChecked = (id: string): boolean => {
    return checked === id;
  };
  const handleCheck = (id: string) => {
    setChecked(id);
    props.onAnswer(id);
  };
  return (
    <>
      <Text style={styles.tytle}>{question.title}</Text>
      {question.answerOptions.map((elm) => (
        <TouchableOpacity
          key={elm.id}
          style={styles.answerItem}
          onPress={() => handleCheck(elm.id)}
        >
          <MaterialIcon
            name={
              isChecked(elm.id) ? "radio-button-checked" : "radio-button-off"
            }
            size={24}
          />
          <Text style={{ marginLeft: 8 }}>{elm.title}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default OneAnswerQuestion;

const styles = StyleSheet.create({
  tytle: {
    fontSize: 28,
    marginVertical: 24,
  },
  answerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
});
