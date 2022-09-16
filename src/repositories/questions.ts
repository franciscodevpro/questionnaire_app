import { QuestionEntity } from "../entities/question.type";
import api from "./api";
import { getLocalQuestionnairesById } from "./questionnaires";

export const getQuestions = async (
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
  const questions = await getRemoteQuestions(
    { idQuestionnaire },
    {
      applierId,
      pin,
      unauthorizad,
    }
  );
  if (!questions || !questions[0]) {
    const localResult = await getLocalQuestionnairesById(
      applierId,
      idQuestionnaire
    );
    return localResult.questions;
  }

  return questions;
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
