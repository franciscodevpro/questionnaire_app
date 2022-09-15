import { QuestionEntity } from "../entities/question.type";
import api from "./api";

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
  const result = await api.get(
    "/questions?idQuestionnaire=" + idQuestionnaire,
    { applierId, pin },
    () => unauthorizad()
  );
  return result?.data || [];
};
