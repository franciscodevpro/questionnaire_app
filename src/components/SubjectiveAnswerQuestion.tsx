import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";

interface SubjectiveAnswerQuestionProps {
  question: {
    title: string;
  };
  onAnswer: (answer: string) => void;
}

const SubjectiveAnswerQuestion = (props: SubjectiveAnswerQuestionProps) => {
  const { question } = props;
  return (
    <>
      <Text style={styles.tytle}>{question.title}</Text>
      <TextInput
        multiline={true}
        style={styles.textInput}
        onChangeText={props.onAnswer}
      />
    </>
  );
};

export default SubjectiveAnswerQuestion;

const styles = StyleSheet.create({
  tytle: {
    fontSize: 28,
    marginVertical: 24,
  },
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    minHeight: 200,
    maxHeight: 500,
    textAlignVertical: "top",
    flexWrap: "wrap",
    marginBottom: 8,
  },
});
