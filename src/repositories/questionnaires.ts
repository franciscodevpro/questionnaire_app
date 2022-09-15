import { QuestionnaireEntity } from "../entities/questionnaire.type";
import api from "./api";

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
  return result?.data || [];
};
