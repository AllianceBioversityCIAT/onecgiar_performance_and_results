export class InnovationUseInfoBody {
  public policy_stage_id: number;
  public policy_type_id: number;
  public amount: number;
  public status_amount: number;
  public institutions: institutionsPCInterface[] = [];
}

export class policyChangeQuestions {
  optionsWithAnswers: optionsWithAnswers[] = [];
  parent_question_id: number | null;
  question_description: string | null;
  question_level: string;
  question_text: string;
  question_type_id: string;
  result_question_id: string;
  result_type_id: number;
}

interface institutionsPCInterface {
  institutions_id: number;
}

interface optionsWithAnswers {
  answer_boolean: boolean | null;
  answer_text: string | null;
  disabled: boolean;
  parent_question_id: string;
  question_description: null;
  question_level: string;
  question_text: string;
  question_type_id: string;
  result_question_id: string;
  result_type_id: number;
  selected: boolean;
}
