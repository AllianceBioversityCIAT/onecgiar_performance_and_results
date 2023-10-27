import { ResultInnovationPackage } from '../entities/result-innovation-package.entity';
import { ResultCountriesSubNational } from '../../../results/result-countries-sub-national/entities/result-countries-sub-national.entity';
export class CreateResultInnovationPackageDto {
  public result_id: number;
  public initiative_id: number;
  public geo_scope_id: number;
  public result_innocation_package: ResultInnovationPackage;
  public regions: regionsInterface[];
  public countries: countriesInterface[];
}
export interface regionsInterface {
  id: number;
  name: string;
}
export interface countriesInterface {
  id: number;
  name: string;
  result_countries_sub_national?: ResultCountriesSubNational[];
}

export class UpdateGeneralInformationDto {
  public title?: string;
  public description?: string;
  public lead_contact_person?: string;
  public gender_tag_level_id?: number;
  public evidence_gender_tag?: string;
  public climate_change_tag_level_id?: number;
  public evidence_climate_tag?: string;
  public nutrition_tag_level_id?: number;
  public evidence_nutrition_tag?: string;
  public environmental_biodiversity_tag_level_id?: number;
  public evidence_environment_tag?: string;
  public poverty_tag_level_id?: number;
  public evidence_poverty_tag?: string;
  public is_krs?: boolean;
  public krs_url?: string;
}
