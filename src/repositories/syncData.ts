import { Alert } from "react-native";
import {
  getLocalAnswers,
  removeLocalAnswersByRegId,
  saveAnswers,
} from "./answers";
import api from "./api";
import { healthCheck } from "./healthcheck";
import { saveQuestionnaireData } from "./questionnaire-data";

export const synchronizeData = async (applierId: string) => {
  Alert.alert(
    "Sincronização de dados",
    "Iniciando incronização de dados. Por favor: aguarde até que a sincronização esteja completa..."
  );
  const serverHealth = await healthCheck();
  if (!serverHealth) {
    Alert.alert(
      "Falha ao tentar sincronizar dados",
      "Não foi possível acessar o servidor. Verifique a conexão com a internet!"
    );
    return;
  }
  const allAnswers = await getLocalAnswers(applierId);
  if (!allAnswers || !allAnswers[0]) return;
  for (let answer of allAnswers) {
    if (answer.questionnaireData?.audioPath) {
      const uploadData = await api.uploadAudio(
        answer.questionnaireData?.audioPath
      );
      answer.questionnaireData.audioPath = uploadData.path;
    }
    const { id } = await saveQuestionnaireData(answer.questionnaireData, {
      applierId: answer.questionnaireData.applierId,
      pin: answer.questionnaireData.pin,
    });
    console.log({ id });
    if (!id) return;
    for (let elm of answer.answers) {
      const {
        idQuestion,
        idAnswerOption,
        idAnswerOptions,
        value,
        duration,
        createdAt,
      } = elm;
      if (!idAnswerOptions || !idAnswerOptions[0])
        await saveAnswers(
          {
            idQuestionnaireData: id,
            idQuestion,
            idAnswerOption,
            value,
            duration,
            createdAt,
          },
          {
            applierId: answer.questionnaireData.applierId,
            pin: answer.questionnaireData.pin,
          }
        );
      else
        for (let element of idAnswerOptions) {
          await saveAnswers(
            {
              idQuestionnaireData: id,
              idQuestion,
              idAnswerOption: element,
              value,
              duration,
              createdAt,
            },
            {
              applierId: answer.questionnaireData.applierId,
              pin: answer.questionnaireData.pin,
            }
          );
        }
    }
    await removeLocalAnswersByRegId(applierId, answer.regId);
  }
};
