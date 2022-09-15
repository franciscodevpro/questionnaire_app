import React, { useContext, useEffect, useState } from "react";
import { ScrollView, ViewProps } from "react-native";
import ListItem from "../components/ListItem";
import MainContext from "../contexts/MainContext";

type QuestionnairesProps = ViewProps & {
  answerQuestionnaire: (id: string) => void;
};

export const Questionnaires = (props: QuestionnairesProps) => {
  const { questionnaires, questionnaireUnsaved } = useContext(MainContext);
  return (
    <ScrollView {...props}>
      {questionnaires.map((item, key) => (
        <ListItem
          key={item.id}
          title={item.name}
          subTitle={
            questionnaireUnsaved[item.id]
              ? questionnaireUnsaved[item.id] +
                " pendente" +
                (questionnaireUnsaved[item.id] > 1 ? "s" : "") +
                " de sincronização"
              : "Nenhuma entrevista pendente"
          }
          onPress={() => props.answerQuestionnaire(item.id)}
        />
      ))}
    </ScrollView>
  );
};
