import React, { createContext } from "react";
import { QuestionnaireEntity } from "../entities/questionnaire.type";

const MainContext = createContext<{
  questionnaires: QuestionnaireEntity[];
  allUnsaved: number;
  questionnaireUnsaved: { [key: string]: number };
  syncData: () => Promise<void>;
  updateAnswers: () => Promise<void>;
  coordinates: [string, string];
}>(null);

export const MainContextProvider = MainContext.Provider;
export const MainContextConsumer = MainContext.Consumer;

export default MainContext;
