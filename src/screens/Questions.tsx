import * as React from "react";
import { Text, View, StyleSheet, ViewProps } from "react-native";

interface QuestionsProps extends ViewProps {}

const Questions = (props: QuestionsProps) => {
  return (
    <View {...props}>
      <Text>Questions</Text>
    </View>
  );
};

export default Questions;
