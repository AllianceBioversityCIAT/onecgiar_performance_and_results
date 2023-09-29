import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ResultsKnowledgeProductAltmetric } from '../entities/results-knowledge-product-altmetrics.entity';
import { HandlersError } from '../../../../shared/handlers/error.utils';
import {
  ReplicableConfigInterface,
  ReplicableInterface,
} from '../../../../shared/globalInterfaces/replicable.interface';
import { VERSIONING } from 'src/shared/utils/versioning.utils';
import { LogicalDelete } from '../../../../shared/globalInterfaces/delete.interface';

@Injectable()
export class ResultsKnowledgeProductAltmetricRepository
  extends Repository<ResultsKnowledgeProductAltmetric>
  implements
    ReplicableInterface<ResultsKnowledgeProductAltmetric>,
    LogicalDelete<ResultsKnowledgeProductAltmetric>
{
  private readonly _logger: Logger = new Logger(
    ResultsKnowledgeProductAltmetricRepository.name,
  );

  constructor(
    private dataSource: DataSource,
    private readonly _handlersError: HandlersError,
  ) {
    super(ResultsKnowledgeProductAltmetric, dataSource.createEntityManager());
  }

  logicalDelete(resultId: number): Promise<ResultsKnowledgeProductAltmetric> {
    const queryData = `update results_kp_altmetrics rka 
    inner join results_knowledge_product rkp on rka.result_knowledge_product_id = rkp.result_knowledge_product_id 
      set rka.is_active = 0
      where rkp.results_id = ?
        and rka.is_active > 0`;
    return this.query(queryData, [resultId])
      .then((res) => res)
      .catch((err) =>
        this._handlersError.returnErrorRepository({
          error: err,
          className: ResultsKnowledgeProductAltmetricRepository.name,
          debug: true,
        }),
      );
  }

  async replicable(
    config: ReplicableConfigInterface<ResultsKnowledgeProductAltmetric>,
  ): Promise<ResultsKnowledgeProductAltmetric> {
    let final_data: ResultsKnowledgeProductAltmetric = null;
    try {
      if (config.f?.custonFunction) {
        const queryData = `
        select 
        null as result_kp_altmetrics_id,
        rkpa.altmetric_id,
        rkpa.journal,
        rkpa.score,
        rkpa.cited_by_posts,
        rkpa.cited_by_delicious,
        rkpa.cited_by_facebook_pages,
        rkpa.cited_by_blogs,
        rkpa.cited_by_forum_users,
        rkpa.cited_by_google_plus_users,
        rkpa.cited_by_linkedin_users,
        rkpa.cited_by_news_outlets,
        rkpa.cited_by_peer_review_sites,
        rkpa.cited_by_pinterest_users,
        rkpa.cited_by_policies,
        rkpa.cited_by_stack_exchange_resources,
        rkpa.cited_by_reddit_users,
        rkpa.cited_by_research_highlight_platforms,
        rkpa.cited_by_twitter_users,
        rkpa.cited_by_youtube_channels,
        rkpa.cited_by_weibo_users,
        rkpa.cited_by_wikipedia_pages,
        null as last_updated,
        rkpa.image_small,
        rkpa.image_medium,
        rkpa.image_large,
        rkpa.is_active,
        now() as created_date,
        null as last_updated_date,
        ${VERSIONING.QUERY.Get_kp_phases(
          config.new_result_id,
        )} as result_knowledge_product_id,
        ? as created_by,
        null as last_updated_by
        from results_kp_altmetrics rkpa WHERE rkpa.result_knowledge_product_id = ${VERSIONING.QUERY.Get_kp_phases(
          config.old_result_id,
        )}
        `;
        const response = await (<Promise<ResultsKnowledgeProductAltmetric[]>>(
          this.query(queryData, [config.user.id])
        ));
        const response_edit = <ResultsKnowledgeProductAltmetric>(
          config.f.custonFunction(response?.length ? response[0] : null)
        );
        final_data = await this.save(response_edit);
      } else {
        const queryData: string = `
        insert into  results_kp_altmetrics 
        (
        altmetric_id,
        journal,
        score,
        cited_by_posts,
        cited_by_delicious,
        cited_by_facebook_pages,
        cited_by_blogs,
        cited_by_forum_users,
        cited_by_google_plus_users,
        cited_by_linkedin_users,
        cited_by_news_outlets,
        cited_by_peer_review_sites,
        cited_by_pinterest_users,
        cited_by_policies,
        cited_by_stack_exchange_resources,
        cited_by_reddit_users,
        cited_by_research_highlight_platforms,
        cited_by_twitter_users,
        cited_by_youtube_channels,
        cited_by_weibo_users,
        cited_by_wikipedia_pages,
        last_updated,
        image_small,
        image_medium,
        image_large,
        is_active,
        created_date,
        last_updated_date,
        result_knowledge_product_id,
        created_by,
        last_updated_by
        )
        select 
        rkpa.altmetric_id,
        rkpa.journal,
        rkpa.score,
        rkpa.cited_by_posts,
        rkpa.cited_by_delicious,
        rkpa.cited_by_facebook_pages,
        rkpa.cited_by_blogs,
        rkpa.cited_by_forum_users,
        rkpa.cited_by_google_plus_users,
        rkpa.cited_by_linkedin_users,
        rkpa.cited_by_news_outlets,
        rkpa.cited_by_peer_review_sites,
        rkpa.cited_by_pinterest_users,
        rkpa.cited_by_policies,
        rkpa.cited_by_stack_exchange_resources,
        rkpa.cited_by_reddit_users,
        rkpa.cited_by_research_highlight_platforms,
        rkpa.cited_by_twitter_users,
        rkpa.cited_by_youtube_channels,
        rkpa.cited_by_weibo_users,
        rkpa.cited_by_wikipedia_pages,
        null as last_updated,
        rkpa.image_small,
        rkpa.image_medium,
        rkpa.image_large,
        rkpa.is_active,
        now() as created_date,
        null as last_updated_date,
        ${VERSIONING.QUERY.Get_kp_phases(
          config.new_result_id,
        )} as result_knowledge_product_id,
        ? as created_by,
        null as last_updated_by
        from results_kp_altmetrics rkpa WHERE rkpa.result_knowledge_product_id = ${VERSIONING.QUERY.Get_kp_phases(
          config.old_result_id,
        )}`;
        await this.query(queryData, [config.user.id]);

        const queryFind = `
        select 
        rkpa.result_kp_altmetrics_id,
        rkpa.altmetric_id,
        rkpa.journal,
        rkpa.score,
        rkpa.cited_by_posts,
        rkpa.cited_by_delicious,
        rkpa.cited_by_facebook_pages,
        rkpa.cited_by_blogs,
        rkpa.cited_by_forum_users,
        rkpa.cited_by_google_plus_users,
        rkpa.cited_by_linkedin_users,
        rkpa.cited_by_news_outlets,
        rkpa.cited_by_peer_review_sites,
        rkpa.cited_by_pinterest_users,
        rkpa.cited_by_policies,
        rkpa.cited_by_stack_exchange_resources,
        rkpa.cited_by_reddit_users,
        rkpa.cited_by_research_highlight_platforms,
        rkpa.cited_by_twitter_users,
        rkpa.cited_by_youtube_channels,
        rkpa.cited_by_weibo_users,
        rkpa.cited_by_wikipedia_pages,
        rkpa.last_updated,
        rkpa.image_small,
        rkpa.image_medium,
        rkpa.image_large,
        rkpa.is_active,
        rkpa.created_date,
        rkpa.last_updated_date,
        rkpa.result_knowledge_product_id,
        rkpa.created_by,
        rkpa.last_updated_by
        from results_kp_altmetrics rkpa WHERE  rkpa.result_knowledge_product_id = ${VERSIONING.QUERY.Get_kp_phases(
          config.new_result_id,
        )}`;
        const temp = await (<Promise<ResultsKnowledgeProductAltmetric[]>>(
          this.query(queryFind, [config.new_result_id])
        ));
        final_data = temp?.length ? temp[0] : null;
      }
    } catch (error) {
      config.f?.errorFunction
        ? config.f.errorFunction(error)
        : this._logger.error(error);
      final_data = null;
    }

    config.f?.completeFunction
      ? config.f.completeFunction(<ResultsKnowledgeProductAltmetric>{
          ...final_data,
        })
      : null;

    return final_data;
  }

  async statusElement(kpId: number, status: boolean) {
    const query = `
      UPDATE results_kp_altmetrics 
      SET is_active = ?
      WHERE result_knowledge_product_id = ?;
    `;
    try {
      return await this.query(query, [status ? 1 : 0, kpId]);
    } catch (error) {
      throw this._handlersError.returnErrorRepository({
        className: ResultsKnowledgeProductAltmetricRepository.name,
        error: error,
        debug: true,
      });
    }
  }
}
