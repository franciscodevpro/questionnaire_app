import React from "react";
import { ScrollView, ViewProps } from "react-native";
import ListItem from "../components/ListItem";

type QuestionnairesProps = ViewProps & {
  answerQuestionnaire: (id: string) => void;
};

export const Questionnaires = (props: QuestionnairesProps) => {
  return (
    <ScrollView {...props}>
      {Array.from({ length: 10 }).map((item, key) => (
        <ListItem
          key={key}
          title="Eleições para senador"
          subTitle="3 pendentes de sincronização"
          onPress={() => props.answerQuestionnaire(key + "125")}
        />
      ))}
    </ScrollView>
  );
};
