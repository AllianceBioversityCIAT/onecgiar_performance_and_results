export interface SubNationalInterface {
  code: string;
  coutry_id: number;
  language_iso_2: string;
  name: string;
  other_names?: otherNameInterface[];
  local_name: string;
  romanization_system_name: string;
  formatedName?: string;
  avalibleName: string;
}

export interface otherNameInterface {
  language_iso_2: string;
  name: string;
  local_name: string;
  romanization_system_name: string;
}

export interface disableOptionsSubNa {
  id: number;
}
