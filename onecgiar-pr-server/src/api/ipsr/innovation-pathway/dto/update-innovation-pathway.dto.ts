import { ResultInnovationPackage } from '../../result-innovation-package/entities/result-innovation-package.entity';
import { CreateInnovationPackagingExpertDto } from '../../innovation-packaging-experts/dto/create-innovation-packaging-expert.dto';
import { ResultByInstitutionsByDeliveriesType } from '../../../results/result-by-institutions-by-deliveries-type/entities/result-by-institutions-by-deliveries-type.entity';
import { ResultsByInstitutionType } from '../../../results/results_by_institution_types/entities/results_by_institution_type.entity';
import { ResultActor } from '../../../results/result-actors/entities/result-actor.entity';
import { ResultIpMeasure } from '../../result-ip-measures/entities/result-ip-measure.entity';
import { CreateResultIPDto } from '../../result-innovation-package/dto/create-result-ip.dto';
export class UpdateInnovationPathwayDto {
    public result_id: number;
    public geo_scope_id: number;
    public result_by_innovation_package_id: number;
    public title: string;
    public experts: CreateInnovationPackagingExpertDto[];
    public result_ip: ResultInnovationPackage & CreateResultIPDto;
    public innovatonUse: innovatonUseInterface;
    public regions: regionsInterface[];
    public countries: countriesInterface[];
    public institutions: institutionsInterface[];
    public sdgTargets: sdgTargetsInterface[];
    public eoiOutcomes: eoiOutcomesInterface[];
    public actionAreaOutcomes: actionAreaOutcomesInterface[];
    public impactAreas: impactAreasInterface[];
    public experts_is_diverse!: boolean;
    public is_not_diverse_justification!: string; 
}
export interface regionsInterface {
    id: number;
    name: string;
}
export interface countriesInterface {
    id: number;
    name: string;
}
export interface eoiOutcomesInterface {
    toc_result_id: number;
}
export interface actionAreaOutcomesInterface {
    action_area_outcome_id: number;
}
export interface impactAreasInterface {
    targetId: number;
}
export interface sdgTargetsInterface {
    usnd_code: number;
    id: number;
}

export interface innovatonUseInterface {
    actors: ResultActor[],
    organization: ResultsByInstitutionType[],
    measures: ResultIpMeasure[];
}

interface institutionsInterface {
    institutions_id: number;
    deliveries?: number[];
}