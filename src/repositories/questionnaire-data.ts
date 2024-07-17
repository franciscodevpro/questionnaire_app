import { Alert } from "react-native";
import { AnswerEntity } from "../entities/answer.type";
import { QuestionnaireDataEntity } from "../entities/questionnaire-data.type";
import api from "./api";

export const saveQuestionnaireData = async (
  {
    idQuestionnaire,
    audioPath,
    lat,
    lon,
    duration,
    createdAt,
  }: QuestionnaireDataEntity,
  {
    applierId,
    pin,
    unauthorizad,
  }: {
    applierId: string;
    pin: string;
    unauthorizad?: () => void;
  }
): Promise<QuestionnaireDataEntity & { id: string }> => {
  const result = await api.post(
    "/questionnaire_data?idQuestionnaire=" + idQuestionnaire,
    { audioPath, lat, lon, duration, createdAt },
    { applierId, pin },
    () => unauthorizad()
  );
  if (!result?.data?.id)
    Alert.alert(
      "Erro ao tentar syncronizar",
      "Confira sua conexão com a internet e tente novamente"
    );
  return result?.data || {};
};

export const saveMultipleQuestionnaireData = async (
  data: {questionnaireData: QuestionnaireDataEntity, answers: AnswerEntity[]}[],
  {
    applierId,
    pin,
    unauthorizad,
  }: {
    applierId: string;
    pin: string;
    unauthorizad?: () => void;
  }
): Promise<QuestionnaireDataEntity & { id: string }> => {
  const result = await api.post(
    "/questionnaire_data/multiple",
    data,
    { applierId, pin },
    () => unauthorizad()
  );
  if (!result?.data?.id)
    Alert.alert(
      "Erro ao tentar syncronizar",
      "Confira sua conexão com a internet e tente novamente"
    );
  return result?.data || {};
};