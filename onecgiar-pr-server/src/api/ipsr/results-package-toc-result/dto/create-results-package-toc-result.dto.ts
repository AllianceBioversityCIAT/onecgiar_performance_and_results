export class CreateResultsPackageTocResultDto {
  result_id: number;
  contributing_initiatives: initiativeInterfaces[];
  contributing_np_projects: donorInterfaceToc[];
  contributing_center: centerInterfacesToc[];
  result_toc_result: resultToResultInterfaceToc;
  contributors_result_toc_result: resultToResultInterfaceToc[];
  pending_contributing_initiatives: shareResultRequestInterface[];
  institutions: institutionsInterface[];
}

interface institutionsInterface {
  institutions_id: number;
  deliveries?: number[];
}

interface initiativeInterfaces {
  id: number;
  is_active: boolean;
}

interface donorInterfaceToc {
  id: number;
  funder: number;
  grant_title: string;
  center_grant_id: string;
  lead_center: string;
}
interface centerInterfacesToc {
  code: string;
  primary?: boolean;
}

interface resultToResultInterfaceToc {
  result_toc_result_id?: number;
  toc_result_id?: number;
  action_area_outcome_id?: number;
  results_id: number;
  planned_result: boolean;
  initiative_id: number;
}

interface shareResultRequestInterface {
  id: number;
  share_result_request_id: number;
  is_active: boolean;
}
