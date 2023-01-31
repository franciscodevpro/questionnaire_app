import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { AnswerEntity } from "../entities/answer.type";
import { QuestionnaireDataEntity } from "../entities/questionnaire-data.type";
import api from "./api";

export const saveLocalAnswers = async (
  questionnaireData: QuestionnaireDataEntity & {
    pin: string;
    applierId: string;
    createdAt?: string;
  },
  answers: AnswerEntity[]
): Promise<void> => {
  const prevValue =
    JSON.parse(
      await AsyncStorage.getItem(
        `@questionnaire:answers:${questionnaireData.applierId}`
      )
    ) || [];
  await AsyncStorage.setItem(
    `@questionnaire:answers:${questionnaireData.applierId}`,
    JSON.stringify([
      ...prevValue,
      {
        regId: uuid.v4(),
        questionnaireData: questionnaireData,
        answers,
      },
    ])
  );
};

export const getLocalAnswers = async (
  applierId: string
): Promise<
  {
    regId: string;
    questionnaireData: QuestionnaireDataEntity & {
      pin: string;
      applierId: string;
      createdAt?: string;
    };
    answers: AnswerEntity[];
  }[]
> => {
  const result = await AsyncStorage.getItem(
    `@questionnaire:answers:${applierId}`
  );
  return !!result ? JSON.parse(result) : [];
};

export const removeLocalAnswersByRegId = async (
  applierId: string,
  regId: string
): Promise<void> => {
  const currentData: {
    regId: string;
    questionnaireData: QuestionnaireDataEntity & {
      pin: string;
      applierId: string;
    };
    answers: AnswerEntity[];
  }[] =
    JSON.parse(
      await AsyncStorage.getItem(`@questionnaire:answers:${applierId}`)
    ) || [];
  await AsyncStorage.setItem(
    `@questionnaire:answers:${applierId}`,
    JSON.stringify(currentData.filter((elm) => elm.regId !== regId))
  );
};

export const removeAllLocalAnswers = async (
  applierId: string
): Promise<void> => {
  await AsyncStorage.removeItem(`@questionnaire:answers:${applierId}`);
};

export const saveAnswers = async (
  {
    idQuestionnaireData = "",
    idQuestion = "",
    idAnswerOption,
    value = "",
    duration = 0,
    createdAt = "",
  }: Required<Omit<AnswerEntity, "idAnswerOptions">> & {
    idQuestionnaireData: string;
  },
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
    "/answers?idQuestionnaireData=" + idQuestionnaireData,
    { idQuestion, idAnswerOption, value, duration, createdAt },
    { applierId, pin },
    () => unauthorizad()
  );
  if (!result?.data?.id) {
    Alert.alert(
      "Erro ao tentar syncronizar",
      "Confira sua conexão com a internet e tente novamente"
    );
    return {} as any;
  }
  return result?.data;
};
