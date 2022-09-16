import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuestionEntity } from "../entities/question.type";
import { QuestionnaireEntity } from "../entities/questionnaire.type";
import api from "./api";

export const saveLocalQuestionnaires = async (
  questionnaire: QuestionnaireEntity & {
    pin: string;
    applierId: string;
  },
  questions: QuestionEntity[]
): Promise<void> => {
  const prevValue =
    JSON.parse(
      await AsyncStorage.getItem(
        `@questionnaire:questions:${questionnaire.applierId}`
      )
    ) || [];
  await AsyncStorage.setItem(
    `@questionnaire:questions:${questionnaire.applierId}`,
    JSON.stringify([
      ...prevValue,
      {
        questionnaire,
        questions,
      },
    ])
  );
};

export const getLocalQuestionnaires = async (
  applierId: string
): Promise<
  {
    questionnaire: QuestionnaireEntity & {
      pin: string;
      applierId: string;
    };
    questions: QuestionEntity[];
  }[]
> => {
  const result = await AsyncStorage.getItem(
    `@questionnaire:questions:${applierId}`
  );
  return !!result ? JSON.parse(result) : [];
};

export const removeLocalQuestionnairesById = async (
  applierId: string,
  id: string
): Promise<void> => {
  const currentData: {
    questionnaire: QuestionnaireEntity & {
      pin: string;
      applierId: string;
    };
    questions: QuestionEntity[];
  }[] =
    JSON.parse(
      await AsyncStorage.getItem(`@questionnaire:questions:${applierId}`)
    ) || [];
  await AsyncStorage.setItem(
    `@questionnaire:questions:${applierId}`,
    JSON.stringify(currentData.filter((elm) => elm.questionnaire.id !== id))
  );
};

export const getLocalQuestionnairesById = async (
  applierId: string,
  id: string
): Promise<{
  questionnaire: QuestionnaireEntity & {
    pin: string;
    applierId: string;
  };
  questions: QuestionEntity[];
}> => {
  const currentData: {
    questionnaire: QuestionnaireEntity & {
      pin: string;
      applierId: string;
    };
    questions: QuestionEntity[];
  }[] =
    JSON.parse(
      await AsyncStorage.getItem(`@questionnaire:questions:${applierId}`)
    ) || [];
  return currentData.find((elm) => elm.questionnaire.id === id) || ({} as any);
};

export const removeAllLocalQuestionnaires = async (
  applierId: string
): Promise<void> => {
  console.log("Removendo dados...");
  await AsyncStorage.removeItem(`@questionnaire:questions:${applierId}`);
  console.log("Dados removidos!");
};

export const getQuestionnaires = async ({
  applierId,
  pin,
  unauthorizad,
}: {
  applierId: string;
  pin: string;
  unauthorizad?: () => void;
}): Promise<QuestionnaireEntity[]> => {
  const result = await api.get("/questionnaires", { applierId, pin }, () =>
    unauthorizad()
  );
  if (!result?.data?.[0]) {
    const localResult = await getLocalQuestionnaires(applierId);
    console.log({ localResult });
    return localResult.map((elm) => elm.questionnaire);
  }

  for (let elm of result.data) {
    const questions = await getRemoteQuestions(
      { idQuestionnaire: elm.id },
      { applierId, pin, unauthorizad }
    );
    await removeLocalQuestionnairesById(applierId, elm.id);
    await saveLocalQuestionnaires({ ...elm, applierId, pin }, questions);
  }

  return result?.data || [];
};

export const getRemoteQuestions = async (
  { idQuestionnaire }: { idQuestionnaire: string },
  {
    applierId,
    pin,
    unauthorizad,
  }: {
    applierId: string;
    pin: string;
    unauthorizad?: () => void;
  }
): Promise<QuestionEntity[]> => {
  const result = await api.get(
    "/questions?idQuestionnaire=" + idQuestionnaire,
    { applierId, pin },
    () => unauthorizad()
  );
  return result?.data || [];
};
