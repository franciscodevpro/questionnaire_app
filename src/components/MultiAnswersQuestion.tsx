import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface MultiAnswersQuestionProps {
  question: {
    title: string;
    answerOptions: {
      id: string;
      title: string;
    }[];
  };
}

const MultiAnswersQuestion = (props: MultiAnswersQuestionProps) => {
  const { question } = props;
  const [checkeds, setCheckeds] = useState<string[] | []>([]);
  const isChecked = (id: string): boolean => {
    return !!checkeds.find((e) => e === id);
  };
  const handleCheck = (id: string) => {
    if (isChecked(id)) return setCheckeds(checkeds.filter((e) => e !== id));
    setCheckeds([...checkeds, id]);
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
            name={isChecked(elm.id) ? "check-box" : "check-box-outline-blank"}
            size={24}
          />
          <Text style={{ marginLeft: 8 }}>{elm.title}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default MultiAnswersQuestion;

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
