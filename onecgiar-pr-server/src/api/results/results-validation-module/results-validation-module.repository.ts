import { Injectable } from '@nestjs/common';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { HandlersError } from '../../../shared/handlers/error.utils';
import { Validation } from './entities/validation.entity';
import { env } from 'process';

@Injectable()
export class resultValidationRepository extends Repository<Validation> {
  constructor(
    private dataSource: DataSource,
    private _handlersError: HandlersError,
  ) {
    super(Validation, dataSource.createEntityManager());
  }

  async oldGreenCheckVersion(resultId: number) {
    const query = `
	SELECT
		v.section_seven,
		v.general_information,
		v.theory_of_change,
		v.partners,
		v.geographic_location,
		v.links_to_results,
		v.evidence
	from
		validation v
	WHERE
		v.results_id = ${resultId}
		and v.is_active > 0
	LIMIT
		1;
  	`;
    try {
      const oldGC = await this.dataSource.query(query);
      return oldGC[0];
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async version() {
    const query = `
	SELECT
		v.id AS version
	FROM
		version v
	WHERE
		v.phase_year = 2023
		AND v.phase_name LIKE '%Reporting%'
		AND v.is_active > 0
	LIMIT 1;
  	`;
    try {
      const version = await this.dataSource.query(query);
      return version[0];
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async generalInformationValidation(
    resultId: number,
    resultLevel: number,
    resultType: number,
  ) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'general-information' as section_name,
		CASE
			when (
				r.title is not null
				and r.title <> ''
			) ${
        resultType != 6
          ? `and 
				(r.description is not null
				and r.description <> '')`
          : ``
      }
			and (
				r.gender_tag_level_id is not null
				and r.gender_tag_level_id <> ''
			)
			and (
				r.climate_change_tag_level_id is not null
				and r.climate_change_tag_level_id <> ''
			)
			and (
				case 
					when r.is_replicated = false then true
				else case 
						when r.is_discontinued = false then true
					else case 
						when (select sum(if(rido.investment_discontinued_option_id = 6, if(rido.description <> '' and rido.description is not null, 1, 0),1)) - count(rido.results_investment_discontinued_option_id) as datas from results_investment_discontinued_options rido where rido.is_active > 0 and rido.result_id = r.id ) = 0 then true
					else false end end end
			)
			and (
				r.nutrition_tag_level_id is not null
				and r.nutrition_tag_level_id <> ''
			)
			and (
				r.environmental_biodiversity_tag_level_id is not null
				and r.environmental_biodiversity_tag_level_id <> ''
			)
			and (
				r.poverty_tag_level_id is not null
				and r.poverty_tag_level_id <> ''
			)
			and (r.is_krs in (0, 1)) ${
        resultLevel != 4 && resultLevel != 1
          ? `and 
				(((
				select
					COUNT(rbi.id)
				from
					results_by_institution rbi
				WHERE
					rbi.institution_roles_id = 1
					and rbi.result_id = r.id
					and rbi.is_active > 0) > 0)
				or
				((
				select
				COUNT(rbit.id)
				from
				results_by_institution_type rbit
				WHERE
					rbit.institution_roles_id = 1
				and rbit.results_id = r.id
				and rbit.is_active > 0) > 0))`
          : ``
      } then true
			else false
		END as validation
	FROM
		\`result\` r
	WHERE
		r.id = ?
		and r.is_active > 0
		and r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async tocValidation(resultId: number, resultLevel: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'theory-of-change' AS section_name,
		CASE
			WHEN (
				(
					SELECT COUNT(rc.id)
					FROM results_center rc
					WHERE rc.is_active > 0
					AND rc.result_id = r.id
				) > 0
			)
			${
        resultLevel != 2 && resultLevel != 1
          ? `AND (
			(
				SELECT SUM(IF(rtr.planned_result is null, 0, 1))
				FROM results_toc_result rtr
				WHERE rtr.results_id = r.id
				AND rtr.is_active > 0
			) - (
				SELECT COUNT(*)
				FROM results_toc_result rtr
				WHERE rtr.results_id = r.id
				AND rtr.is_active > 0
			) = 0
		)
		AND (
			(
				SELECT IF(rtr.toc_result_id IS NOT NULL, 1, 0)
				FROM results_toc_result rtr
				WHERE rtr.initiative_id IN (rbi.inititiative_id)
				AND rtr.results_id = r.id
				AND rtr.is_active > 0
			) = 1
		)
		AND  (
			(
				IFNULL(
					(
						SELECT SUM(IF(rtr.toc_result_id IS NULL, 1, 0))
						FROM results_toc_result rtr
						WHERE rtr.initiative_id NOT IN (rbi.inititiative_id)
						AND rtr.results_id = r.id
						AND rtr.is_active > 0
					),
					0
				)
			) - (
				SELECT COUNT(rbi.id)
				FROM results_by_inititiative rbi
				WHERE rbi.result_id = r.id
				AND rbi.initiative_role_id = 2
				AND rbi.is_active > 0
			)
		) = 0`
          : ``
      }
			${
        resultLevel == 1
          ? `
					AND (
						(SELECT COUNT(DISTINCT cgt.impactAreaId)
						FROM results_impact_area_target riat 
						INNER JOIN clarisa_global_targets cgt ON cgt.targetId = riat.impact_area_target_id 
						WHERE riat.result_id = r.id
						AND riat.impact_area_target_id IS NULL
						AND riat.is_active > 0) < 5
					)
					AND (
						(SELECT COUNT(DISTINCT ciai.impact_area_id)
						FROM results_impact_area_indicators riai 
						INNER JOIN clarisa_impact_area_indicator ciai ON ciai.id = riai.impact_area_indicator_id 
						WHERE riai.result_id = r.id
						AND riai.impact_area_indicator_id IS NULL
						AND riai.is_active > 0) < 5
					)
				`
          : ``
      }
	  AND  (
		(
			SELECT
				IFNULL(
					SUM(IF(npp.funder_institution_id IS NOT NULL AND npp.funder_institution_id <> '' AND 
						npp.grant_title IS NOT NULL AND npp.grant_title <> '' AND
						npp.lead_center_id IS NOT NULL AND npp.lead_center_id <> '', 1, 0)),
					0
				) - IFNULL(COUNT(npp.id), 0)
			FROM non_pooled_project npp
			WHERE npp.results_id = r.id
			AND npp.is_active > 0
		) = 0
	) 
			${
        resultLevel == 3 || resultLevel == 4
          ? `AND IF((select count(*)
		  from  ${env.DB_TOC}.toc_results tr
			  join ${env.DB_TOC}.toc_results_indicators tri on tri.toc_results_id = tr.id
			  where id = rtr1.toc_result_id and tr.phase = (select v.toc_pahse_id
												from result r2
												join version v on r2.version_id = v.id
												where r2.id = r.id)) > 0, IF((select SUM(IF(rit.indicator_question IS NOT NULL AND rit.contributing_indicator <> '' AND rit.contributing_indicator IS NOT NULL, 1, 0)) 
												from results_toc_result rtr 
												left join results_toc_result_indicators rtri on rtri.results_toc_results_id = rtr.result_toc_result_id 
																							and rtri.is_active > 0
												left join result_indicators_targets rit on rit.result_toc_result_indicator_id = rtri.result_toc_result_indicator_id 
																							and rit.is_active > 0
												where rtr.results_id = r.id
													and rtr.is_active > 0) > 0, TRUE, FALSE), TRUE )
			AND IF(rtr1.is_sdg_action_impact, IF(
				(SELECT COUNT(*) 
				FROM result_toc_impact_area_target rtiat 
				WHERE rtiat.result_toc_result_id = rtr1.result_toc_result_id 
				AND rtiat.is_active > 0) > 0
				AND 
				(SELECT COUNT(*) 
				FROM result_toc_action_area rtaa  
				WHERE rtaa.result_toc_result_id = rtr1.result_toc_result_id  
				AND rtaa.is_active > 0) > 0
				AND
				(SELECT COUNT(*) 
				FROM result_toc_sdg_targets rtst  
				WHERE rtst.result_toc_result_id = rtr1.result_toc_result_id 
				AND rtst.is_active > 0) > 0, TRUE, FALSE
			), TRUE)
													THEN TRUE`
          : resultLevel == 1 || resultLevel == 2
          ? `AND (SELECT COUNT(*) 
		  FROM result_sdg_targets rst 
		  WHERE rst.result_id = r.id
			  AND rst.is_active > 0) > 0
		${
      resultLevel == 2
        ? `AND (SELECT COUNT(*) 
		FROM result_toc_action_area rtaa  
		WHERE rtaa.result_toc_result_id = rtr1.result_toc_result_id  
		AND rtaa.is_active > 0) > 0`
        : ``
    }
		AND 
			(SELECT COUNT(*) 
			FROM results_impact_area_target riat 
			WHERE riat.result_id = r.id
				AND riat.is_active > 0) > 0
		THEN TRUE`
          : `THEN TRUE`
      }
			ELSE FALSE
		END AS validation
	FROM
		\`result\` r
	INNER JOIN results_by_inititiative rbi ON rbi.result_id = r.id AND rbi.initiative_role_id = 1
	LEFT JOIN results_toc_result rtr1 ON rtr1.results_id = r.id
	  		AND rtr1.is_active > 0
	WHERE
		r.id = ?
	AND
		r.is_active > 0
	AND
		r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async partnersValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'partners' AS section_name,
		CASE
			WHEN r.no_applicable_partner = 1 THEN TRUE
			WHEN (
				(
					SELECT
						COUNT(rbi.id)
					FROM
						results_by_institution rbi
					WHERE
						rbi.result_id = r.id
						AND (
							rbi.institution_roles_id = 2
							OR rbi.institution_roles_id = 8
						)
						AND rbi.is_active > 0
				) <= 0
			) THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					results_by_institution rbi2
				WHERE
					rbi2.result_id = r.id
					AND (
						rbi2.institution_roles_id = 2
						OR rbi2.institution_roles_id = 8
					)
					AND rbi2.is_active = TRUE
			) != (
				SELECT
					COUNT(DISTINCT rbibdt.result_by_institution_id)
				FROM
					result_by_institutions_by_deliveries_type rbibdt
				WHERE
					rbibdt.is_active = TRUE
					AND rbibdt.result_by_institution_id IN (
						SELECT
							rbi4.id
						FROM
							results_by_institution rbi4
						WHERE
							rbi4.result_id = r.id
							AND (
								rbi4.institution_roles_id = 2
								OR rbi4.institution_roles_id = 8
							)
							AND rbi4.is_active = TRUE
					)
			) THEN FALSE
			ELSE TRUE
		END AS validation
	FROM
		\`result\` r
	WHERE
		r.id = ?
		AND r.is_active > 0
		AND r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async geoLocationValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	select
		'geographic-location' as section_name,
		CASE
			when (
				(
					if(
						r.has_regions = 1,
						(
							(
								select
									count(rr.result_region_id)
								from
									result_region rr
								WHERE
									rr.result_id = r.id
									and rr.is_active > 0
							) > 0
						),
						if(r.has_regions is null, false, true)
					)
				)
				AND (
					if(
						r.has_countries = 1,
						(
							(
								select
									count(rc.result_country_id)
								from
									result_country rc
								WHERE
									rc.result_id = r.id
									and rc.is_active > 0
							) > 0
						),
						if(r.has_countries is null, false, true)
					)
				)
			) then true
			else false
		END as validation
	from
		result r
	WHERE
		r.id = ?
		and r.is_active > 0
		and r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async linksResultsValidation(resultId: number) {
    const queryData = `
	
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async evidenceValidation(resultTypeId: number, resultId: number) {
    const { version } = await this.version();

    try {
      const queryData = `
		SELECT
			'evidences' AS section_name,
			CASE
				WHEN (
					(
						(
							SELECT
								IF(
									(
										SUM(
											IF(
												e.link IS NOT NULL
												AND e.link <> '',
												1,
												0
											)
										) - COUNT(e.id)
									) IS NULL,
									0,
									(
										SUM(
											IF(
												e.link IS NOT NULL
												AND e.link <> '',
												1,
												0
											)
										) - COUNT(e.id)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) = 0
					)
					AND (
						(
							SELECT
								SUM(
									IF(
										r.gender_tag_level_id = 3
										AND e.gender_related = 1,
										1,
										IF(
											r.gender_tag_level_id IN (1, 2),
											1,
											IF(r.gender_tag_level_id IS NULL, 1, 0)
										)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) > 0
					)
					AND (
						(
							SELECT
								SUM(
									IF(
										r.climate_change_tag_level_id = 3
										AND e.youth_related = 1,
										1,
										IF(
											r.climate_change_tag_level_id IN (1, 2),
											1,
											IF(r.climate_change_tag_level_id IS NULL, 1, 0)
										)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) > 0
					)
					AND (
						(
							SELECT
								SUM(
									IF(
										r.nutrition_tag_level_id = 3
										AND e.nutrition_related = 1,
										1,
										IF(
											r.nutrition_tag_level_id IN (1, 2),
											1,
											IF(r.nutrition_tag_level_id IS NULL, 1, 0)
										)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) > 0
					)
					AND (
						(
							SELECT
								SUM(
									IF(
										r.environmental_biodiversity_tag_level_id = 3
										AND e.environmental_biodiversity_related = 1,
										1,
										IF(
											r.environmental_biodiversity_tag_level_id IN (1, 2),
											1,
											IF(
												r.environmental_biodiversity_tag_level_id IS NULL,
												1,
												0
											)
										)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) > 0
					)
					AND (
						(
							SELECT
								SUM(
									IF(
										r.poverty_tag_level_id = 3
										AND e.poverty_related = 1,
										1,
										IF(
											r.poverty_tag_level_id IN (1, 2),
											1,
											IF(r.poverty_tag_level_id IS NULL, 1, 0)
										)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 0
								AND e.is_active > 0
						) > 0
					)
					AND (
						(
							SELECT
								IF(
									(
										SUM(
											IF(
												e.link IS NOT NULL
												AND e.link <> '',
												1,
												0
											)
										) - COUNT(e.id)
									) IS NULL,
									0,
									(
										SUM(
											IF(
												e.link IS NOT NULL
												AND e.link <> '',
												1,
												0
											)
										) - COUNT(e.id)
									)
								)
							FROM
								evidence e
							WHERE
								e.result_id = r.id
								AND e.is_supplementary = 1
								AND e.is_active > 0
						) = 0
					)
				) THEN TRUE
				ELSE FALSE
			END AS validation
		FROM
			result r
			LEFT JOIN results_innovations_dev rid ON rid.results_id = r.id
			AND rid.is_active > 0
		WHERE
			r.id = ${resultId}
			AND r.is_active > 0
			AND r.version_id = ${version};
	`;

      const level = await this.innoReadinessLevel(resultId);
      let isAnyDAC3 = false;

      if (resultTypeId == 7) {
        const dacQuery = `
			SELECT
				r.gender_tag_level_id,
				r.climate_change_tag_level_id,
				r.nutrition_tag_level_id,
				r.environmental_biodiversity_tag_level_id,
				r.poverty_tag_level_id
			FROM 
				result r
			WHERE
				r.id = ${resultId}
				AND r.is_active > 0
				AND r.version_id = ${version};
		`;

        const dacResults = await this.dataSource.query(dacQuery);
        isAnyDAC3 = dacResults.some(
          (row: any) =>
            row.gender_tag_level_id == 3 ||
            row.climate_change_tag_level_id == 3 ||
            row.nutrition_tag_level_id == 3 ||
            row.environmental_biodiversity_tag_level_id == 3 ||
            row.poverty_tag_level_id == 3,
        );

        if (isAnyDAC3) {
          const evidenceValidations: GetValidationSectionDto[] =
            await this.dataSource.query(queryData);

          return evidenceValidations.length
            ? evidenceValidations[0]
            : undefined;
        } else if (resultTypeId == 7 && level == 0) {
          const response = {
            section_name: 'evidences',
            validation: 1,
          };

          return response;
        }
      }
      const evidenceValidations: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);

      return evidenceValidations.length ? evidenceValidations[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async innovationUseValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'innovation-use-info' as section_name,
		CASE
			WHEN (
				(
					SELECT
						COUNT(*)
					FROM
						result_actors ra
					WHERE
						ra.result_id = r.id
						AND ra.is_active = 1
						AND (
							(
								ra.sex_and_age_disaggregation = 0
								AND (
									(
										ra.actor_type_id != 5
										AND ra.women IS NOT NULL
										AND ra.women_youth IS NOT NULL
										AND ra.men IS NOT NULL
										AND ra.men_youth IS NOT NULL
									)
									OR (
										ra.actor_type_id = 5
										AND (
											ra.other_actor_type IS NOT NULL
											OR TRIM(ra.other_actor_type) <> ''
										)
									)
								)
							)
							OR (
								ra.sex_and_age_disaggregation = 1
								OR (
									ra.actor_type_id = 5
									AND (
										ra.other_actor_type IS NOT NULL
										AND TRIM(ra.other_actor_type) <> ''
										AND ra.how_many IS NOT NULL
									)
								)
							)
						)
				) = 0
				AND (
					SELECT
						COUNT(*)
					FROM
						results_by_institution_type rbit
					WHERE
						rbit.results_id = r.id
						AND rbit.is_active = true
						AND rbit.institution_roles_id = 5
						AND (
							(
								rbit.institution_types_id != 78
								AND(
									rbit.institution_roles_id IS NOT NULL
									AND rbit.institution_types_id IS NOT NULL
								)
							)
							OR (
								rbit.institution_types_id = 78
								AND (
									rbit.other_institution IS NOT NULL
									OR rbit.other_institution != ''
									AND rbit.institution_roles_id IS NOT NULL
									AND rbit.institution_types_id IS NOT NULL
								)
							)
						)
				) = 0
				AND (
					SELECT
						COUNT(*)
					FROM
						result_ip_measure rim
					WHERE
						rim.result_id = r.id
						AND rim.is_active = TRUE
						AND rim.unit_of_measure IS NOT NULL
				) = 0
			) THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_actors ra
				WHERE
					ra.result_id = r.id
					AND ra.is_active = 1
					AND (
						(
							ra.sex_and_age_disaggregation = 0
							AND (
								ra.women IS NULL
								AND ra.women IS NULL
								AND ra.women_youth IS NULL
								AND ra.men IS NULL
								AND ra.men_youth IS NULL
								OR (
									ra.actor_type_id = 5
									AND (
										ra.other_actor_type IS NULL
										OR TRIM(ra.other_actor_type) = ''
									)
								)
							)
						)
						OR (
							ra.sex_and_age_disaggregation = 1
							AND ra.how_many IS NULL
							OR (
								ra.actor_type_id = 5
								AND (
									ra.other_actor_type IS NULL
									OR TRIM(ra.other_actor_type) = ''
								)
							)
						)
					)
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					results_by_institution_type rbit
				WHERE
					rbit.results_id = r.id
					AND rbit.is_active = true
					AND rbit.institution_roles_id = 5
					AND (
						rbit.institution_roles_id IS NULL
						OR rbit.institution_types_id IS NULL
						OR (
							rbit.institution_types_id = 78
							AND (
								rbit.other_institution IS NULL
								OR rbit.other_institution = ''
							)
						)
					)
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_ip_measure rim
				WHERE
					rim.result_id = r.id
					AND rim.is_active = TRUE
					AND (
						rim.unit_of_measure IS NULL
						OR rim.quantity IS NULL
					)
			) > 0 THEN FALSE
			ELSE TRUE
		END AS validation
	FROM
		result r
	WHERE
		r.id = ?
		AND r.is_active > 0
		AND r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async innovationDevValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'innovation-dev-info' as section_name,
		CASE
			when (
				rid.short_title is null
				or rid.short_title = ''
			)
			AND (
				rid.innovation_characterization_id is null
				or rid.innovation_characterization_id = ''
			)
			AND (
				rid.innovation_nature_id is null
				or rid.innovation_nature_id = ''
			)
			AND (
				if(
					rid.innovation_nature_id != 12,
					rid.is_new_variety not in (1, 0),
					false
				)
			)
			AND (
				rid.innovation_readiness_level_id is null
				and rid.innovation_readiness_level_id <> ''
			) 
			AND (rid.innovation_pdf NOT IN (1, 0)) THEN FALSE
			WHEN rid.innovation_user_to_be_determined != 1
			AND (
				(
					SELECT
						COUNT(*)
					FROM
						result_actors ra
					WHERE
						ra.result_id = r.id
						AND ra.is_active = 1
						AND (
							(
								ra.sex_and_age_disaggregation = 0
								AND (
									(
										ra.actor_type_id != 5
										AND ra.has_women IS NOT NULL
										AND ra.has_women_youth IS NOT NULL
										AND ra.has_men IS NOT NULL
										AND ra.has_men_youth IS NOT NULL
									)
									OR (
										ra.actor_type_id = 5
										AND (
											ra.other_actor_type IS NOT NULL
											OR TRIM(ra.other_actor_type) <> ''
										)
									)
								)
							)
							OR (
								ra.sex_and_age_disaggregation = 1
								OR (
									ra.actor_type_id = 5
									AND (
										ra.other_actor_type IS NOT NULL
										AND TRIM(ra.other_actor_type) <> ''
										AND ra.how_many IS NOT NULL
									)
								)
							)
						)
				) = 0
				AND (
					SELECT
						COUNT(*)
					FROM
						results_by_institution_type rbit
					WHERE
						rbit.results_id = r.id
						AND rbit.is_active = true
						AND (
							(
								rbit.institution_types_id != 78
								AND(
									rbit.institution_roles_id IS NOT NULL
									AND rbit.institution_types_id IS NOT NULL
								)
							)
							OR (
								rbit.institution_types_id = 78
								AND (
									rbit.other_institution IS NOT NULL
									OR rbit.other_institution != ''
									AND rbit.institution_roles_id IS NOT NULL
									AND rbit.institution_types_id IS NOT NULL
								)
							)
						)
				) = 0
				AND (
					SELECT
						COUNT(*)
					FROM
						result_ip_measure rim
					WHERE
						rim.result_id = r.id
						AND rim.is_active = TRUE
						AND rim.unit_of_measure IS NOT NULL
				) = 0
			) THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_actors ra
				WHERE
					ra.result_id = r.id
					AND ra.is_active = 1
					AND (
						(
							ra.sex_and_age_disaggregation = 0
							AND (
								ra.women IS NULL
								AND ra.has_women IS NULL
								AND ra.has_women_youth IS NULL
								AND ra.has_men IS NULL
								AND ra.has_men_youth IS NULL
								OR (
									ra.actor_type_id = 5
									AND (
										ra.other_actor_type IS NULL
										OR TRIM(ra.other_actor_type) = ''
									)
								)
							)
						)
						OR (
							ra.sex_and_age_disaggregation = 1
							AND (
								ra.actor_type_id = 5
								AND (
									ra.other_actor_type IS NULL
									OR TRIM(ra.other_actor_type) = ''
								)
							)
						)
					)
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					results_by_institution_type rbit
				WHERE
					rbit.results_id = r.id
					AND rbit.is_active = true
					AND (
						rbit.institution_roles_id IS NULL
						OR rbit.institution_types_id IS NULL
						OR (
							rbit.institution_types_id = 78
							AND (
								rbit.other_institution IS NULL
								OR rbit.other_institution = ''
							)
						)
					)
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_ip_measure rim
				WHERE
					rim.result_id = r.id
					AND rim.is_active = TRUE
					AND (rim.unit_of_measure IS NULL)
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_questions rq
					LEFT JOIN result_answers ra2 ON rq.result_question_id = ra2.result_question_id
				WHERE
					ra2.result_id = r.id
					AND ra2.is_active = TRUE
					AND ra2.answer_boolean = TRUE
					AND (
						rq.parent_question_id = 2
						OR rq.parent_question_id = 3
					)
			) != 2 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_questions rq
					LEFT JOIN result_answers ra2 ON rq.result_question_id = ra2.result_question_id
				WHERE
					ra2.result_id = r.id
					AND ra2.is_active = TRUE
					AND ra2.answer_boolean = TRUE
					AND (
						ra2.result_question_id = 4
						OR ra2.result_question_id = 8
					)
			) != (
				SELECT
					COUNT(DISTINCT rq2.parent_question_id)
				FROM
					result_answers ra3
					LEFT JOIN result_questions rq2 ON rq2.result_question_id = ra3.result_question_id
				WHERE
					ra3.result_id = r.id
					AND ra3.is_active = TRUE
					AND ra3.answer_boolean = TRUE
					AND (
						rq2.parent_question_id = 4
						OR rq2.parent_question_id = 8
					)
			) THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_answers ra4
					LEFT JOIN result_questions rq3 ON rq3.result_question_id = ra4.result_question_id
				WHERE
					ra4.result_id = r.id
					AND ra4.is_active = TRUE
					AND rq3.result_question_id IN (17, 24)
					AND ra4.answer_boolean = TRUE
					AND ra4.answer_text IS NULL
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_questions rq
					LEFT JOIN result_answers ra2 ON rq.result_question_id = ra2.result_question_id
				WHERE
					ra2.result_id = r.id
					AND ra2.is_active = TRUE
					AND ra2.answer_boolean = TRUE
					AND rq.parent_question_id = 27
			) = 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_questions rq
					LEFT JOIN result_answers ra2 ON rq.result_question_id = ra2.result_question_id
				WHERE
					ra2.result_id = r.id
					AND ra2.is_active = TRUE
					AND ra2.answer_boolean = TRUE
					AND rq.parent_question_id = 27
			) = 0 THEN FALSE
			WHEN (
				(
					SELECT
						COUNT(*)
					FROM
						result_answers ra2
					WHERE
						ra2.result_id = r.id
						AND ra2.is_active = TRUE
						AND ra2.answer_boolean = TRUE
						AND (
							ra2.result_question_id = 30
							OR ra2.result_question_id = 31
						)
				) != (
					SELECT
						COUNT(*)
					FROM
						result_answers ra5
						LEFT JOIN result_questions rq4 ON rq4.result_question_id = ra5.result_question_id
					WHERE
						ra5.result_id = r.id
						AND ra5.is_active = TRUE
						AND ra5.answer_boolean = TRUE
						AND rq4.parent_question_id = 28
				)
			) THEN FALSE
			WHEN (
				(
					SELECT
						COUNT(*)
					FROM
						result_answers ra2
					WHERE
						ra2.result_id = r.id
						AND ra2.is_active = TRUE
						AND ra2.answer_boolean = TRUE
						AND (
							ra2.result_question_id = 33
							OR ra2.result_question_id = 34
						)
				) != (
					SELECT
						COUNT(*)
					FROM
						result_answers ra5
						LEFT JOIN result_questions rq4 ON rq4.result_question_id = ra5.result_question_id
					WHERE
						ra5.result_id = r.id
						AND ra5.is_active = TRUE
						AND ra5.answer_boolean = TRUE
						AND rq4.parent_question_id = 29
				)
			) THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_initiative_budget ripb
				WHERE
					result_initiative_id IN (
						SELECT
							rbi.id
						FROM
							results_by_inititiative rbi
						WHERE
							rbi.is_active = 1
							AND rbi.result_id = r.id
					)
					AND is_active = TRUE
					AND (
						ripb.is_determined != 1
						OR ripb.is_determined IS NULL
					)
					AND ripb.kind_cash IS NULL
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					non_pooled_projetct_budget nppb
				WHERE
					nppb.non_pooled_projetct_id IN (
						SELECT
							npp.id
						FROM
							non_pooled_project npp
						WHERE
							npp.is_active = 1
							AND npp.results_id = r.id
					)
					AND nppb.is_active = 1
					AND (
						nppb.is_determined != 1
						OR nppb.is_determined IS NULL
					)
					AND nppb.kind_cash IS NULL
			) > 0 THEN FALSE
			WHEN (
				SELECT
					COUNT(*)
				FROM
					result_institutions_budget ribu
				WHERE
					ribu.result_institution_id IN (
						SELECT
							rbi.id
						FROM
							results_by_institution rbi
						WHERE
							rbi.is_active = 1
							AND rbi.result_id = r.id
					)
					AND ribu.is_active = 1
					AND (
						ribu.is_determined != 1
						OR ribu.is_determined IS NULL
					)
					AND ribu.kind_cash IS NULL
			) > 0 THEN FALSE
			WHEN (
				rid.innovation_pdf = 1
				AND (
					SELECT 
						COUNT(*)
					FROM 
						evidence e 
					WHERE
						e.result_id = r.id
						AND e.evidence_type_id = 3
						AND e.is_active = 1
				) < 3
			) THEN FALSE
			WHEN (
				rid.innovation_pdf = 1
				AND (
					SELECT 
						COUNT(*)
					FROM 
						evidence e 
					WHERE
						e.result_id = r.id
						AND e.evidence_type_id = 4
						AND e.is_active = 1
				) < 3
			) THEN FALSE
			ELSE TRUE
		END AS validation
	from
		result r
		LEFT JOIN results_innovations_dev rid on rid.results_id = r.id
		AND rid.is_active > 0
	WHERE
		r.id = ?
		AND r.is_active > 0
		and r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async knowledgeProductValidation(resultId: number) {
    const queryData = `
	select
		'knowledge-product-info' as section_name,
		CASE
			when (
				if(
					rkp.is_melia = 1,
					if(
						rkp.melia_previous_submitted = 1,
						rkp.ost_melia_study_id is not null
						and rkp.ost_melia_study_id <> '',
						rkp.melia_type_id is not null
						and rkp.melia_type_id <> ''
					),
					if(rkp.is_melia is not null, true, false)
				)
			) then true
			else false
		END as validation
	from
		\`result\` r
		left join results_knowledge_product rkp on rkp.results_id = r.id
	WHERE
		r.id = ?
		and r.is_active > 0;
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async capDevValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'cap-dev-info' as section_name,
		CASE
			WHEN (
				rcd.unkown_using = 0
				AND (
					rcd.female_using IS NULL
					OR rcd.female_using = 0
					OR rcd.male_using IS NULL
					OR rcd.male_using = 0
					OR non_binary_using IS NULL
					OR non_binary_using = 0
				)
			) THEN FALSE
			WHEN (
				rcd.unkown_using = 1
				AND (
					rcd.has_unkown_using IS NULL
					OR rcd.has_unkown_using = 0
				)
			) THEN FALSE
			WHEN (
				rcd.capdev_term_id IS NULL
				OR rcd.capdev_term_id = ''
			)
			OR (
				rcd.capdev_delivery_method_id IS NULL
				OR rcd.capdev_delivery_method_id = ''
			)
			OR (rcd.is_attending_for_organization IS NULL) THEN FALSE
			WHEN (
				rcd.is_attending_for_organization = 1
				AND (
					SELECT
						count(rbi.id)
					FROM
						results_by_institution rbi
					WHERE
						rbi.result_id = r.id
						AND rbi.institution_roles_id = 3
						AND rbi.is_active > 0
				) = 0
			) THEN FALSE
			ELSE TRUE
		END AS validation
	FROM
		result r
		LEFT JOIN results_capacity_developments rcd ON rcd.result_id = r.id
		AND rcd.is_active > 0
	WHERE
		r.id = ?
		AND r.is_active > 0
		AND r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async policyChangeValidation(resultId: number) {
    const { version } = await this.version();

    const queryData = `
	SELECT
		'policy-change1-info' as section_name,
		CASE
			when (rpc.policy_type_id is not null
			and rpc.policy_type_id <> '')
			AND 
			(rpc.policy_stage_id is not null
			and rpc.policy_stage_id <> '')
			AND 
			((
			SELECT
				count(rbi.id)
			from
				results_by_institution rbi
			where
				rbi.result_id = r.id
				and rbi.institution_roles_id = 4
				and rbi.is_active > 0) > 0)
			then TRUE
			else false
		END as validation
	from
		\`result\` r
	left join results_policy_changes rpc on
		rpc.result_id = r.id
		and rpc.is_active > 0
	WHERE
		r.id = ?
		and r.is_active > 0
		and r.version_id = ${version};
    `;
    try {
      const shareResultRequest: GetValidationSectionDto[] =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length ? shareResultRequest[0] : undefined;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async validationResultExist(resultId: number) {
    const queryData = `
	SELECT
		v.id,
		v.section_seven,
		v.general_information,
		v.theory_of_change,
		v.partners,
		v.geographic_location,
		v.links_to_results,
		v.evidence,
		v.results_id
	from
		validation v
	WHERE
		v.results_id = ?
		and v.is_active > 0
	order by v.id desc;
    `;
    try {
      const shareResultRequest: Validation[] = await this.dataSource.query(
        queryData,
        [resultId],
      );
      return shareResultRequest.length ? shareResultRequest[0] : null;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async resultIsValid(resultId: number) {
    const queryData = `
	SELECT
		IFNULL(v.section_seven, 1) *
  		v.general_information *
  		v.theory_of_change *
  		v.partners *
  		v.geographic_location *
  		v.links_to_results *
  		v.evidence as validation
  	from validation v 
  		WHERE v.results_id = ?
		  and v.is_active > 0;
    `;
    try {
      const shareResultRequest: Array<{ validation: string }> =
        await this.dataSource.query(queryData, [resultId]);
      return shareResultRequest.length
        ? parseInt(shareResultRequest[0].validation)
        : 0;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async inactiveOldInserts(resultId: number) {
    const queryData = `
		UPDATE validation 
			set is_active = 0
		WHERE results_id = ?;
    `;
    try {
      const shareResultRequest = await this.dataSource.query(queryData, [
        resultId,
      ]);
      return shareResultRequest;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async inactiveAllOldInserts() {
    const queryData = `
		UPDATE validation 
			set is_active = 0;
    `;
    try {
      const shareResultRequest = await this.dataSource.query(queryData);
      return shareResultRequest;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }

  async innoReadinessLevel(resultId: number) {
    const { version } = await this.version();

    const innovationDevValidation = `
		SELECT
			cirl.level
		FROM
			results_innovations_dev rid
			LEFT JOIN clarisa_innovation_readiness_level cirl ON cirl.id = rid.innovation_readiness_level_id
			LEFT JOIN result r ON r.id = rid.results_id
		WHERE
			rid.results_id = ?
			AND rid.is_active > 0
			AND r.version_id = ${version};
	`;

    try {
      const innovationDevValidationResult: Array<{ level: number }> =
        await this.dataSource.query(innovationDevValidation, [resultId]);

      return innovationDevValidationResult.length
        ? innovationDevValidationResult[0].level
        : null;
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: resultValidationRepository.name,
        error: error,
        debug: true,
      });
    }
  }
}
