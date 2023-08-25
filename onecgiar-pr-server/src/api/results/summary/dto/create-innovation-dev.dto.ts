import { ResultIpMeasure } from "../../../ipsr/result-ip-measures/entities/result-ip-measure.entity";
import { Evidence } from "../../evidences/entities/evidence.entity";
import { ResultActor } from "../../result-actors/entities/result-actor.entity";
import { ResultsByInstitutionType } from "../../results_by_institution_types/entities/results_by_institution_type.entity";

export class CreateInnovationDevDto {
  public result_innovation_dev_id: number;
  public short_title: string;
  public innovation_characterization_id: number;
  public innovation_nature_id: number;
  public innovation_readiness_level_id: number;
  public is_new_variety: boolean;
  public number_of_varieties: number;
  public innovation_developers: string;
  public innovation_collaborators: string;
  public readiness_level: string;
  public evidences_justification: string;
  public innovation_acknowledgement: string;
  public innovation_pdf!: boolean;
  public responsible_innovation_and_scaling!: TopLevelQuestions;
  public intellectual_property_rights!: TopLevelQuestions;
  public innovation_team_diversity!: TopLevelQuestions;
  public reference_materials!: Evidence[]
  public pictures!: Evidence[];
  public innovatonUse: innovatonUseInterface;
}
export interface SubOption {
  result_question_id: number;
  answer_boolean: boolean;
  answer_text: string;
}

export interface Option {
  result_question_id: number;
  answer_boolean: boolean;
  answer_text: string;
  subOptions: SubOption[];
}

export interface TopLevelQuestions {
  q1: {
    options: Option[];
  };
  q2: {
    options: Option[];
  };
  q3: {
    options: Option[];
  };
  options: Option[]
}

export interface innovatonUseInterface {
  actors: ResultActor[];
  organization: ResultsByInstitutionType[];
  measures: ResultIpMeasure[];
}