export type QuestionEntity = {
  id: string;
  idQuestionnaire?: string;
  title: string;
  variable?: string;
  type: string;
  minAnswers: number;
  maxAnswers: number;
  defaultValue: string;
  shuffle: boolean;
  prioritizeBySelection: boolean;
  answerOptions: {
    id: string;
    idQuestion?: string;
    title: string;
    status: boolean;
  }[];
};
