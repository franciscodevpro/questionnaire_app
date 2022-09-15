import { QuestionnaireDataEntity } from "../entities/questionnaire-data.type";
import api from "./api";

export const saveQuestionnaireData = async (
  { idQuestionnaire, audioPath, lat, lon, duration }: QuestionnaireDataEntity,
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
    { audioPath, lat, lon, duration },
    { applierId, pin },
    () => unauthorizad()
  );
  return result?.data || {};
};
