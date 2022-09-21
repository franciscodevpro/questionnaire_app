import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View, ViewProps } from "react-native";
import ListItem from "../components/ListItem";
import MainContext from "../contexts/MainContext";

type QuestionnairesProps = ViewProps & {
  answerQuestionnaire: (id: string) => void;
};

export const Questionnaires = (props: QuestionnairesProps) => {
  const { questionnaires, questionnaireUnsaved } = useContext(MainContext);
  return (
    <>
      {!questionnaires[0] ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              opacity: 0.3,
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Nenhum questionário atribuído à você foi encontrado.
          </Text>
        </View>
      ) : (
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
      )}
    </>
  );
};
